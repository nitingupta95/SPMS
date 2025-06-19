"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// console.log("DATABASE_URL =", process.env.DATABASE_URL);
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const index_1 = require("./prisma/index");
const cron_1 = require("./cron");
const cors_1 = __importDefault(require("cors"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "hi_there_my_name_is_nitin_gupta";
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, cron_1.startCron)();
const corsOrigin = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOrigin));
app.post('/api/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const existingUser = yield index_1.client.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield index_1.client.user.create({
            data: { username, email, password: hashedPassword },
        });
        const token = jsonwebtoken_1.default.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, username: newUser.username, id: newUser.id });
    }
    catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Server error during signup', error: err.message });
    }
}));
app.post('/api/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield index_1.client.user.findUnique({ where: { email } });
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, username: user.username, id: user.id });
    }
    catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({ message: 'Server error during signin', error: err.message });
    }
}));
app.post("/api/student", middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const newStudent = yield index_1.client.student.create({ data });
        return res.json(newStudent);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.get("/api/student", middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield index_1.client.student.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return res.json(students);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error", err });
    }
}));
app.get("/api/student/:id", middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const student = yield index_1.client.student.findUnique({
            where: { id },
            include: {
                contestHistories: true,
                submissions: true,
            },
        });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        return res.json(Object.assign(Object.assign({}, student), { contestHistory: student.contestHistories.map(ch => (Object.assign(Object.assign({}, ch), { date: ch.date.toISOString() // Ensure proper date serialization
             }))), submissions: student.submissions.map(s => (Object.assign(Object.assign({}, s), { timestamp: s.timestamp.toISOString() }))) }));
    }
    catch (error) {
        console.error("Error fetching student:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.put("/api/student/:id", middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    try {
        const updated = yield index_1.client.student.update({
            where: { id },
            data,
        });
        return res.json(updated);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error", err });
    }
}));
app.delete("/api/student/:id", middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield index_1.client.contestHistory.deleteMany({ where: { studentId: id } });
        yield index_1.client.submission.deleteMany({ where: { studentId: id } });
        yield index_1.client.student.delete({
            where: { id },
        });
        return res.json({ message: "Deleted" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.post('/api/contact', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format',
            });
        }
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'ng61315@gmail.com',
                pass: 'ooct vgrr xflr qvgs',
            },
        });
        // Email options
        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: 'ng61315@gmail.com',
            subject: `[SPMS Contact] ${subject}`,
            html: `
        <h2>📥 New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
        };
        // Send email
        yield transporter.sendMail(mailOptions);
        res.status(200).json({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
            data: {
                id: `msg_${Date.now()}`,
                timestamp: new Date().toISOString(),
                status: 'received',
            },
        });
    }
    catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
        });
    }
}));
app.get("/api/sync/:handle", middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const handle = req.params.handle;
    try {
        const [infoRes, ratingRes, statusRes] = yield Promise.all([
            (0, node_fetch_1.default)(`https://codeforces.com/api/user.info?handles=${handle}`),
            (0, node_fetch_1.default)(`https://codeforces.com/api/user.rating?handle=${handle}`),
            (0, node_fetch_1.default)(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`),
        ]);
        const infoJson = yield infoRes.json();
        ;
        const ratingJson = yield ratingRes.json();
        ;
        const statusJson = yield statusRes.json();
        ;
        const info = (_a = infoJson.result) === null || _a === void 0 ? void 0 : _a[0];
        const ratings = ratingJson.result;
        const submissions = statusJson.result;
        if (!info || !ratings || !submissions) {
            return res.status(404).json({ error: "Invalid handle or data not found" });
        }
        const student = yield index_1.client.student.findUnique({
            where: { codeforcesHandle: handle },
        });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        yield index_1.client.$transaction([
            index_1.client.contestHistory.deleteMany({ where: { studentId: student.id } }),
            index_1.client.submission.deleteMany({ where: { studentId: student.id } }),
            index_1.client.contestHistory.createMany({
                data: ratings.map((r) => ({
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
            index_1.client.submission.createMany({
                data: submissions.map((s) => {
                    var _a, _b, _c, _d;
                    return ({
                        studentId: student.id,
                        problemName: (_b = (_a = s.problem) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "Unknown Problem",
                        problemRating: (_d = (_c = s.problem) === null || _c === void 0 ? void 0 : _c.rating) !== null && _d !== void 0 ? _d : null,
                        verdict: s.verdict,
                        timestamp: new Date(s.creationTimeSeconds * 1000),
                        isSolved: s.verdict === "OK",
                    });
                }),
            }),
            index_1.client.student.update({
                where: { id: student.id },
                data: {
                    currentRating: (_b = info.rating) !== null && _b !== void 0 ? _b : 0,
                    maxRating: (_c = info.maxRating) !== null && _c !== void 0 ? _c : 0,
                    lastSyncedAt: new Date(),
                },
            }),
        ]);
        return res.json({ message: "Synced successfully" });
    }
    catch (err) {
        console.error("Sync error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.patch('/api/student/:id/toggle-reminder', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const student = yield index_1.client.student.findUnique({ where: { id } });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const updated = yield index_1.client.student.update({
            where: { id },
            data: { emailRemindersEnabled: !student.emailRemindersEnabled },
        });
        return res.json({
            id: updated.id,
            emailRemindersEnabled: updated.emailRemindersEnabled,
        });
    }
    catch (error) {
        console.error('Error toggling reminder:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
