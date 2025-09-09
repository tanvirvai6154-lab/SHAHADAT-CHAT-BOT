// autoNews.js
// Auto send Bangladesh news every 30 minutes in all groups
// Credits: Akash

const axios = require("axios");
const schedule = require("node-schedule");

module.exports.config = {
  name: "autoNews",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Akash",
  description: "সব গ্রুপে ৩০ মিনিট পর পর দেশের খবর পাঠাবে ফ্যান্সি স্টাইলে",
  commandCategory: "Utility",
  usages: "অটো চলবে, কোনো কমান্ড দরকার নেই",
  cooldowns: 0
};

// সব গ্রুপের ID এখানে রাখবে
let threadList = [];

// আগের নিউজ ট্র্যাক করার জন্য
let lastNewsTitle = "";

// নিউজ পাঠানোর ফাংশন
const sendNews = async (api, threadID) => {
  try {
    const res = await axios.get(
      "https://newsapi.org/v2/top-headlines?country=bd&apiKey=YOUR_API_KEY"
    );

    if (res.data.articles && res.data.articles.length > 0) {
      const article = res.data.articles[0];

      // আগের নিউজের সাথে মিল হলে স্কিপ
      if (article.title === lastNewsTitle) return;

      lastNewsTitle = article.title;

      const message = `🇧🇩 🔥 নতুন ব্রেকিং নিউজ 🔥 🇧🇩\n\n📰 ${article.title}\n📌 বিস্তারিত: ${article.url}\n⏰ আপডেট সময়: ${new Date().toLocaleTimeString("bn-BD")}`;

      api.sendMessage(message, threadID);
    }
  } catch (err) {
    console.error("News Error:", err.message);
  }
};

// প্রতি ৩০ মিনিটে সব গ্রুপে নিউজ পাঠানো
schedule.scheduleJob("*/30 * * * *", async function () {
  for (const threadID of threadList) {
    await sendNews(global.client.api, threadID);
  }
});

// নতুন গ্রুপে বট অ্যাড হলে threadID যোগ করা
module.exports.handleEvent = async function({ event }) {
  if (!threadList.includes(event.threadID)) {
    threadList.push(event.threadID);
  }
};
