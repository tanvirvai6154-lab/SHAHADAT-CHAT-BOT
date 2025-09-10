// lockgc.js
// গ্রুপ লক/আনলক সিস্টেম (ফলে ব্যাকআপ সহ)

module.exports.config = {
  name: "lockgc",
  version: "1.1.0",
  credits: "Akash",
  description: "Lock & Unlock Group messages with backup alert system"
};

let lockStatus = {}; // group-wise লক স্ট্যাটাস

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

  const help = `🛠️ গ্রুপ লক কমান্ড:\n• /lockgc lockgc — গ্রুপ লক করবে\n• /lockgc unlockgc — গ্রুপ আনলক করবে\n• /lockgc statusgc — স্ট্যাটাস দেখাবে`;
  return api.sendMessage(help, threadID);
};

// নন-অ্যাডমিন মেসেজ ব্লক / সতর্কবার্তা
module.exports.handleEvent = async function({ api, event }) {
  const threadID = event.threadID;
  const senderID = event.senderID;

  if (!lockStatus[threadID]) return;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const isAdmin = threadInfo.adminIDs.some(e => e.id == senderID);

    if (!isAdmin) {
      // বট যদি অ্যাডমিন হয়, মেসেজ ডিলিট করবে
      if (threadInfo.adminIDs.some(e => e.id == api.getCurrentUserID())) {
        try { await api.unsendMessage(event.messageID); } catch(e) {}
      } else {
        // বট অ্যাডমিন না হলে সতর্কবার্তা পাঠাবে
        return api.sendMessage("🚫 গ্রুপ লক আছে — আপনি লিখতে পারবেন না!", threadID);
      }
    }
  } catch (e) {
    console.error("lockgc handleEvent error:", e);
  }
};
