// azan.js
// Auto Azan notification in ALL groups (Real-time from API)
const axios = require("axios");
const schedule = require("node-schedule");

module.exports.config = {
    name: "azan",
    version: "4.0.0",
    hasPermssion: 0,
    credits: "Akash",
    description: "প্রতিদিন আজানের সঠিক সময় সব গ্রুপে অটো নোটিফিকেশন পাঠাবে",
    commandCategory: "Islamic",
    usages: "অটো রান",
    cooldowns: 5
};

let jobs = [];

// আজানের জন্য API থেকে টাইম নিয়ে শিডিউল সেট করা
async function scheduleAzan(api) {
    try {
        // বাংলাদেশের আজানের সময়ের API
        const res = await axios.get("http://api.aladhan.com/v1/timingsByCity", {
            params: {
                city: "Dhaka",
                country: "Bangladesh",
                method: 2 // Islamic Society of North America
            }
        });

        const timings = res.data.data.timings;

        // আগের সব জব বন্ধ করা
        jobs.forEach(job => job.cancel());
        jobs = [];

        // আজানের টাইম অনুযায়ী নতুন জব তৈরি
        for (const [prayer, time] of Object.entries(timings)) {
            // শুধুমাত্র ৫টি নামাজের জন্য
            if (["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].includes(prayer)) {
                let [hour, minute] = time.split(":").map(Number);

                // ঢাকার টাইম অনুযায়ী শিডিউল
                const rule = new schedule.RecurrenceRule();
                rule.tz = "Asia/Dhaka";
                rule.hour = hour;
                rule.minute = minute;

                const job = schedule.scheduleJob(rule, function() {
                    const msg = `__আসসালামু আলাইকুম 🕌__\n${prayer} এর আজান দিচ্ছে...!! সবাই ওযু করে নামাজের জন্য প্রস্তুত হও ইনশাআল্লাহ 🤲`;

                    for (const threadID of global.data.allThreadID) {
                        api.sendMessage(msg, threadID);
                    }
                });

                jobs.push(job);
            }
        }

        console.log("✅ আজান নোটিফিকেশন সিস্টেম চালু হয়েছে (সঠিক সময় অনুযায়ী)!");
    } catch (err) {
        console.error("❌ আজান টাইম নেওয়ার সময় সমস্যা হয়েছে:", err.message);
    }
}

module.exports.onLoad = async function({ api }) {
    await scheduleAzan(api);

    // প্রতি ২৪ ঘন্টায় API থেকে নতুন সময় নিয়ে শিডিউল আপডেট করবে
    schedule.scheduleJob("0 0 * * *", function() {
        scheduleAzan(api);
    });
};

module.exports.run = async function() {
    // অটো রান করবে, কোনো কমান্ডের দরকার নেই
};
