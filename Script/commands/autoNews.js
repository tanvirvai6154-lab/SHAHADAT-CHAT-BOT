// autoNews.js
// Auto send Bangladesh news every 30 minutes
// Credit: 𝙼𝚘𝚑𝚊𝚖𝚖𝚊𝚍 𝙰𝚔𝚊𝚜𝚑

const axios = require("axios");
const schedule = require("node-schedule");

module.exports.config = {
  name: "autoNews",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝙼𝚘𝚑𝚊𝚖𝚖𝚊𝚍 𝙰𝚔𝚊𝚜𝚑",
  description: "বাংলাদেশের নিউজ অটো আপডেট পাঠাবে প্রতি ৩০ মিনিট পর",
  commandCategory: "News",
  cooldowns: 5,
};

let job = null;

module.exports.run = async function({ api, event }) {
  if (job) {
    job.cancel();
    job = null;
    return api.sendMessage("❌ অটো নিউজ বন্ধ হয়েছে।", event.threadID);
  }

  job = schedule.scheduleJob("*/30 * * * *", async function () {
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=bd&apiKey=68af051e74bb44e0bf6ce50c98df5b73`;

      const res = await axios.get(url);
      const articles = res.data.articles.slice(0, 5);

      if (!articles.length) return;

      let newsMsg = "📰 সর্বশেষ বাংলাদেশ নিউজ আপডেট:\n\n";
      articles.forEach((a, i) => {
        newsMsg += `${i + 1}. ${a.title}\n${a.url}\n\n`;
      });

      // Send to all groups
      global.data.allThreadID.forEach(threadID => {
        api.sendMessage(newsMsg, threadID);
      });

    } catch (err) {
      console.error(err);
    }
  });

  return api.sendMessage("✅ অটো নিউজ চালু হয়েছে (প্রতি ৩০ মিনিট পর পাঠাবে)।", event.threadID);
};
