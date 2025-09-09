// azan.js
// Auto Azan notification in ALL groups
// File: modules/commands/azan.js

const schedule = require("node-schedule");

module.exports.config = {
  name: "azan",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Akash",
  description: "প্রতিদিন আজানের সময় সব গ্রুপে অটো নোটিফিকেশন পাঠাবে",
  commandCategory: "Islamic",
  usages: "অটো রান",
  cooldowns: 5
};

let jobs = [];

module.exports.onLoad = async function({ api }) {
  // আজানের টাইম (বাংলাদেশ স্ট্যান্ডার্ড টাইম)
  const prayerTimes = {
    "ফজর": "04:40",
    "যোহর": "12:10",
    "আসর": "15:30",
    "মাগরিব": "18:15",
    "এশা": "19:45"
  };

  for (let [prayer, time] of Object.entries(prayerTimes)) {
    const [hour, minute] = time.split(":").map(Number);

    const job = schedule.scheduleJob({ hour, minute, tz: "Asia/Dhaka" }, function () {
      const msg = 
`__আসসালামু আলাইকুম 🕌__

${prayer} এর আজান দিচ্ছে...!!
সবাই ওযু করে নামাজের জন্য প্রস্তুত হও ইনশাআল্লাহ 🤲`;

      // সব গ্রুপে পাঠাবে
      for (const threadID of global.data.allThreadID) {
        api.sendMessage(msg, threadID);
      }
    });

    jobs.push(job);
  }

  console.log("✅ আজান নোটিফিকেশন সিস্টেম চালু হয়েছে (সব গ্রুপে)।");
};

module.exports.run = async function() {
  // কোনো কমান্ড দরকার নেই, অটো চলবে
};
