 
import cron from 'node-cron';
import { client } from './prisma/index';
import nodemailer from 'nodemailer';

const CODEFORCES_API_BASE = 'https://codeforces.com/api';

async function fetchCodeforcesData(handle: string) {
  const [infoRes, ratingRes, statusRes] = await Promise.all([
    fetch(`${CODEFORCES_API_BASE}/user.info?handles=${handle}`),
    fetch(`${CODEFORCES_API_BASE}/user.rating?handle=${handle}`),
    fetch(`${CODEFORCES_API_BASE}/user.status?handle=${handle}&from=1&count=10000`)
  ]);

  const info = (await infoRes.json()).result?.[0];
  const ratings = (await ratingRes.json()).result;
  const submissions = (await statusRes.json()).result;

  return { info, ratings, submissions };
}

async function syncStudent(student: any) {
  const { info, ratings, submissions } = await fetchCodeforcesData(student.codeforcesHandle);
  if (!info) return;

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
        date: new Date(r.ratingUpdateTimeSeconds * 1000)
      }))
    }),
    client.submission.createMany({
      data: submissions.map((s: any) => ({
        studentId: student.id,
        problemName: s.problem.name,
        problemRating: s.problem.rating ?? null,
        verdict: s.verdict,
        timestamp: new Date(s.creationTimeSeconds * 1000),
        isSolved: s.verdict === 'OK'
      }))
    }),
    client.student.update({
      where: { id: student.id },
      data: {
        currentRating: info.rating ?? 0,
        maxRating: info.maxRating ?? 0,
        lastSyncedAt: new Date()
      }
    })
  ]);

  // Check for inactivity
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentActivity = await client.submission.findFirst({
    where: {
      studentId: student.id,
      timestamp: { gte: sevenDaysAgo }
    }
  });

  if (!recentActivity && student.emailRemindersEnabled) {
    await sendReminderEmail(student.email, student.name);
    await client.student.update({
      where: { id: student.id },
      data: { inactiveReminders: { increment: 1 } }
    });
  }
}

async function sendReminderEmail(email: string, name: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.REMINDER_EMAIL,
      pass: process.env.REMINDER_PASS
    }
  });

  await transporter.sendMail({
    from: `"Codeforces Tracker" <${process.env.REMINDER_EMAIL}>`,
    to: email,
    subject: '👨‍💻 Time to Practice on Codeforces!',
    html: `<p>Hey ${name},</p><p>We noticed you haven’t made any submissions in the past 7 days.</p><p>Let’s get back to solving problems and improving your skills!</p><p>— Student Progress Tracker</p>`
  });
}

export function startCron() {
  cron.schedule('0 2 * * *', async () => {
    console.log('⏰ Daily Sync Job Running...');
    const students = await client.student.findMany();
    for (const student of students) {
      try {
        await syncStudent(student);
      } catch (err) {
        console.error(`❌ Failed to sync ${student.codeforcesHandle}:`, err);
      }
    }
    console.log('✅ Daily Sync Completed.');
  });
}
