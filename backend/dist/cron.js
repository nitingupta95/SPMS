"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCron = startCron;
const node_cron_1 = __importDefault(require("node-cron"));
const index_1 = require("./prisma/index");
const nodemailer_1 = __importDefault(require("nodemailer"));
const CODEFORCES_API_BASE = 'https://codeforces.com/api';
async function fetchCodeforcesData(handle) {
    var _a;
    const [infoRes, ratingRes, statusRes] = await Promise.all([
        fetch(`${CODEFORCES_API_BASE}/user.info?handles=${handle}`),
        fetch(`${CODEFORCES_API_BASE}/user.rating?handle=${handle}`),
        fetch(`${CODEFORCES_API_BASE}/user.status?handle=${handle}&from=1&count=10000`)
    ]);
    const info = (_a = (await infoRes.json()).result) === null || _a === void 0 ? void 0 : _a[0];
    const ratings = (await ratingRes.json()).result;
    const submissions = (await statusRes.json()).result;
    return { info, ratings, submissions };
}
async function syncStudent(student) {
    var _a, _b;
    const { info, ratings, submissions } = await fetchCodeforcesData(student.codeforcesHandle);
    if (!info)
        return;
    await index_1.client.$transaction([
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
                date: new Date(r.ratingUpdateTimeSeconds * 1000)
            }))
        }),
        index_1.client.submission.createMany({
            data: submissions.map((s) => {
                var _a;
                return ({
                    studentId: student.id,
                    problemName: s.problem.name,
                    problemRating: (_a = s.problem.rating) !== null && _a !== void 0 ? _a : null,
                    verdict: s.verdict,
                    timestamp: new Date(s.creationTimeSeconds * 1000),
                    isSolved: s.verdict === 'OK'
                });
            })
        }),
        index_1.client.student.update({
            where: { id: student.id },
            data: {
                currentRating: (_a = info.rating) !== null && _a !== void 0 ? _a : 0,
                maxRating: (_b = info.maxRating) !== null && _b !== void 0 ? _b : 0,
                lastSyncedAt: new Date()
            }
        })
    ]);
    // Check for inactivity
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentActivity = await index_1.client.submission.findFirst({
        where: {
            studentId: student.id,
            timestamp: { gte: sevenDaysAgo }
        }
    });
    if (!recentActivity && student.emailRemindersEnabled) {
        await sendReminderEmail(student.email, student.name);
        await index_1.client.student.update({
            where: { id: student.id },
            data: { inactiveReminders: { increment: 1 } }
        });
    }
}
async function sendReminderEmail(email, name) {
    const transporter = nodemailer_1.default.createTransport({
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
function startCron() {
    node_cron_1.default.schedule('0 2 * * *', async () => {
        console.log('⏰ Daily Sync Job Running...');
        const students = await index_1.client.student.findMany();
        for (const student of students) {
            try {
                await syncStudent(student);
            }
            catch (err) {
                console.error(`❌ Failed to sync ${student.codeforcesHandle}:`, err);
            }
        }
        console.log('✅ Daily Sync Completed.');
    });
}
