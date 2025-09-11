const fs = require("fs");
const request = require("request");

let lastPlayed = -1;

module.exports.config = {
  name: "gan",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Akash",
  description: "Play random song with prefix command",
  commandCategory: "music",
  usages: "[prefix]gan",
  cooldowns: 5
};

// Catbox লিংক দেওয়া হলো
const songLinks = [
  "https://files.catbox.moe/92riji.mp3"
];

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (songLinks.length === 0) {
    return api.sendMessage("❌ কোনো গান লিস্টে পাওয়া যায়নি!", threadID, messageID);
  }

  // রিঅ্যাকশন দাও প্রসেসিং বোঝাতে
  api.setMessageReaction("⌛", messageID, () => {}, true);

  // র‍্যান্ডম গান বেছে নাও
  let index;
  do {
    index = Math.floor(Math.random() * songLinks.length);
  } while (index === lastPlayed && songLinks.length > 1);

  lastPlayed = index;
  const url = songLinks[index];
  const filePath = `${__dirname}/cache/mysong_${index}.mp4`; // mp4 ফরম্যাট

  // ডাউনলোড ও পাঠানো
  request(encodeURI(url))
    .pipe(fs.createWriteStream(filePath))
    .on("close", () => {
      api.sendMessage({
        body: "🎶 Here's your requested song:",
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        try {
          fs.unlinkSync(filePath); // ফাইল ডিলিট
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      }, messageID);
    })
    .on("error", (err) => {
      console.error("Download error:", err);
      api.sendMessage("❌ গান/ভিডিও ডাউনলোড করতে সমস্যা হয়েছে।", threadID, messageID);
    });
};
