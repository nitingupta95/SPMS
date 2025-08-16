// console.log("DATABASE_URL =", process.env.DATABASE_URL);

import express from "express";
import type { Request, Response } from "express";
import { Prisma } from '@prisma/client';
import fetch from "node-fetch";
import { client } from "./prisma/index";
import { startCron } from "./cron";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateToken } from "./middleware";

const JWT_SECRET = "hi_there_my_name_is_nitin_gupta";

const app = express();
app.use(express.json());
startCron();

const corsOrigin = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOrigin));


 

console.log("DATABASE_URL from runtime:", process.env.DATABASE_URL);

/* ----------------- AUTH ----------------- */
app.post("/api/signup", async (req: Request, res: Response): Promise<any> => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await client.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await client.user.create({
      data: { username, email, password: hashedPassword },
    });

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: "24h" });

    res
      .status(201)
      .json({ token, username: newUser.username, id: newUser.id });
  } catch (err: any) {
    console.error("Signup error:", err);
    res
      .status(500)
      .json({ message: "Server error during signup", error: err.message });
  }
});

app.post("/api/signin", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await client.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, username: user.username, id: user.id });
  } catch (err: any) {
    console.error("Signin error:", err);
    res
      .status(500)
      .json({ message: "Server error during signin", error: err.message });
  }
});

/* ----------------- STUDENTS CRUD ----------------- */
app.post(
  "/api/student",
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const data = req.body;
      const newStudent = await client.student.create({ data });
      return res.json(newStudent);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.get(
  "/api/student",
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const students = await client.student.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.json(students);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error", err });
    }
  }
);
 

 

app.get(
  "/api/student/:id",
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
      const student=await client.student.findUnique({
          where: { id },
          include: {
            contestHistories: true,
            submissions: true,
          },
        });

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      return res.json({
        ...student,
        contestHistory: student.contestHistories.map((ch:any) => ({
          ...ch,
          date: ch.date.toISOString(),
        })),
        submissions: student.submissions.map((s:any) => ({
          ...s,
          timestamp: s.timestamp.toISOString(),
        })),
      });
    } catch (error) {
      console.error("Error fetching student:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);





app.put(
  "/api/student/:id",
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const data = req.body;

    try {
      const updated = await client.student.update({
        where: { id },
        data,
      });
      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error", err });
    }
  }
);

app.delete(
  "/api/student/:id",
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
      await client.contestHistory.deleteMany({ where: { studentId: id } });
      await client.submission.deleteMany({ where: { studentId: id } });
      await client.student.delete({
        where: { id },
      });
      return res.json({ message: "Deleted" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

/* ----------------- CONTACT FORM ----------------- */
app.post("/api/contact", async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ng61315@gmail.com",
        pass: "ooct vgrr xflr qvgs", // ⚠️ move to .env
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "ng61315@gmail.com",
      subject: `[SPMS Contact] ${subject}`,
      html: `
        <h2>📥 New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
      data: {
        id: `msg_${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: "received",
      },
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
});

/* ----------------- SYNC WITH CODEFORCES ----------------- */
app.get(
  "/api/sync/:handle",
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    const handle = req.params.handle;

    try {
      const [infoRes, ratingRes, statusRes] = await Promise.all([
        fetch(`https://codeforces.com/api/user.info?handles=${handle}`),
        fetch(`https://codeforces.com/api/user.rating?handle=${handle}`),
        fetch(
          `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`
        ),
      ]);

      const infoJson = (await infoRes.json()) as { result: any[] };
      const ratingJson = (await ratingRes.json()) as { result: any[] };
      const statusJson = (await statusRes.json()) as { result: any[] };

      const info = infoJson.result?.[0];
      const ratings = ratingJson.result;
      const submissions = statusJson.result;

      if (!info || !ratings || !submissions) {
        return res
          .status(404)
          .json({ error: "Invalid handle or data not found" });
      }

      const student = await client.student.findUnique({
        where: { codeforcesHandle: handle },
      });

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      await client.$transaction([
        client.contestHistory.deleteMany({ where: { studentId: student.id } }),
        client.submission.deleteMany({ where: { studentId: student.id } }),
        client.contestHistory.createMany({
          data: ratings.map((r: any) => ({
            studentId: student.id,
            contestId: r.contestId,
            contestName: r.contestName,
            rank: r.rank,
            oldRating: r.oldRating,
            newRating: r.newRating,
            ratingChange: r.newRating - r.oldRating,
            date: new Date(r.ratingUpdateTimeSeconds * 1000),
          })),
        }),
        client.submission.createMany({
          data: submissions.map((s: any) => ({
            studentId: student.id,
            problemName: s.problem?.name ?? "Unknown Problem",
            problemRating: s.problem?.rating ?? null,
            verdict: s.verdict,
            timestamp: new Date(s.creationTimeSeconds * 1000),
            isSolved: s.verdict === "OK",
          })),
        }),
        client.student.update({
          where: { id: student.id },
          data: {
            currentRating: info.rating ?? 0,
            maxRating: info.maxRating ?? 0,
            lastSyncedAt: new Date(),
          },
        }),
      ]);

      return res.json({ message: "Synced successfully" });
    } catch (err) {
      console.error("Sync error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

/* ----------------- REMINDERS ----------------- */
app.patch(
  "/api/student/:id/toggle-reminder",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;

      const student = await client.student.findUnique({ where: { id } });
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      const updated = await client.student.update({
        where: { id },
        data: { emailRemindersEnabled: !student.emailRemindersEnabled },
      });

      return res.json({
        id: updated.id,
        emailRemindersEnabled: updated.emailRemindersEnabled,
      });
    } catch (error) {
      console.error("Error toggling reminder:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
