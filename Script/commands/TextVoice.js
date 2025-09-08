module.exports.config = {
  name: "text_voice",
  version: "1.0",
  hasPermssion: 0,
  credits: "𝗦𝗵𝗮𝗵𝗮𝗱𝗮𝘁 𝗦𝗔𝗛𝗨",
  description: "নির্দিষ্ট টেক্সট দিলে কিউট মেয়ের ভয়েস প্লে করবে 😍 (ইমোজি নয়)",
  commandCategory: "noprefix",
  usages: "হাই, কিউট, ভালোবাসি",
  cooldowns: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Text অনুযায়ী audio URL
const textAudioMap = {
  "হাই": "https://files.catbox.moe/60cwcg.mp3",
  "কিউট": "https://files.catbox.moe/dv9why.mp3",
  "ভালোবাসি": "https://files.catbox.moe/qjfk1b.mp3",
  "লাভ": "https://files.catbox.moe/dv9why.mp3",
  "সুপ্রভাত": "https://files.catbox.moe/9pou40.mp3",
  "শুভরাত্রি": "https://files.catbox.moe/rm5ozj.mp3",
  "ধন্যবাদ": "https://files.catbox.moe/7avi7u.mp3",
  "মজা": "https://files.catbox.moe/utl83s.mp3",
  "হাহা": "https://files.catbox.moe/2sweut.mp3",
  "কেমন আছো": "https://files.catbox.moe/epqwbx.mp3"
};

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const key = body.trim();

  // কেবলমাত্র টেক্সট চেক, ইমোজি নয়
  const audioUrl = textAudioMap[key];
  if (!audioUrl) return; // যদি টেক্সট ম্যাপে না থাকে কিছু হবে না

  const cacheDir = path.join(__dirname, 'cache');
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const filePath = path.join(cacheDir, `${encodeURIComponent(key)}.mp3`);

  try {
    const response = await axios({
      method: 'GET',
      url: audioUrl,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on('finish', () => {
      api.sendMessage({
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }, messageID);
    });

    writer.on('error', (err) => {
      console.error("Error writing file:", err);
      api.sendMessage("ভয়েস প্লে হয়নি 😅", threadID, messageID);
    });

  } catch (error) {
    console.error("Error downloading audio:", error);
    api.sendMessage("ভয়েস প্লে হয়নি 😅", threadID, messageID);
  }
};

module.exports.run = () => {};
