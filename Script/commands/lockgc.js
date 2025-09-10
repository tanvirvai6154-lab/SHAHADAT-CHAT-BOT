// lockgc.js
// গ্রুপ লক/আনলক সিস্টেম
// নন-অ্যাডমিনদের মেসেজ ব্লক করবে

module.exports.config = {
  name: "lockgc",
  version: "1.0.0",
  credits: "Akash",
  description: "Lock & Unlock Group messages using /lockgc"
};

let lockStatus = {}; // group-wise লক স্ট্যাটাস

// কমান্ড হ্যান্ডলার
module.exports.run = async function({ api, event, args }) {
  const threadID = event.threadID;
  const senderID = event.senderID;

  // গ্রুপ ইনফো
  const threadInfo = await api.getThreadInfo(threadID);
  const isAdmin = threadInfo.adminIDs.some(e => e.id == senderID);

  if (!isAdmin) {
    return api.sendMessage("❌ এই কমান্ড শুধু অ্যাডমিন ব্যবহার করতে পারবে!", threadID, event.messageID);
  }

  const command = args[0]?.toLowerCase();

  if (command === "lockgc") {
    lockStatus[threadID] = true;
    return api.sendMessage("🔒 গ্রুপ লক করা হয়েছে — শুধু অ্যাডমিনরা লিখতে পারবে।", threadID);
  }

  if (command === "unlockgc") {
    lockStatus[threadID] = false;
    return api.sendMessage("🔓 গ্রুপ আনলক করা হয়েছে — সবাই লিখতে পারবে।", threadID);
  }

  if (command === "statusgc") {
    const status = lockStatus[threadID] ? "🔒 লক করা আছে" : "🔓 আনলক করা আছে";
    return api.sendMessage(`📌 গ্রুপের স্ট্যাটাস: ${status}`, threadID);
  }

  // হেল্প মেসেজ
  const help = `🛠️ গ্রুপ লক কমান্ড ব্যবহার:\n• /lockgc lockgc — গ্রুপ লক করবে\n• /lockgc unlockgc — গ্রুপ আনলক করবে\n• /lockgc statusgc — স্ট্যাটাস দেখাবে`;
  return api.sendMessage(help, threadID);
};

// নন-অ্যাডমিন মেসেজ ব্লক
module.exports.handleEvent = async function({ api, event }) {
  const threadID = event.threadID;
  const senderID = event.senderID;

  if (lockStatus[threadID]) {
    const threadInfo = await api.getThreadInfo(threadID);
    const isAdmin = threadInfo.adminIDs.some(e => e.id == senderID);

    if (!isAdmin) {
      try {
        await api.unsendMessage(event.messageID);
      } catch (e) {
        // কোনো সমস্যা হলে সাইলেন্ট ফেইল
      }
    }
  }
};
