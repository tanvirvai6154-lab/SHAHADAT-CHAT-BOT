module.exports.config = {
  name: "groupcontrol",
  version: "1.0.0",
  credits: "Akash",
  description: "Lock & Unlock Group messages"
};

let lockStatus = {}; // group wise লক স্ট্যাটাস রাখবে

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const senderID = event.senderID;

  // প্রথমে গ্রুপের ইনফো আনা
  const threadInfo = await api.getThreadInfo(threadID);
  const isAdmin = threadInfo.adminIDs.some(e => e.id == senderID);

  if (!isAdmin) {
    return api.sendMessage("❌ এই কমান্ড শুধু অ্যাডমিন ব্যবহার করতে পারবে!", threadID, event.messageID);
  }

  const command = args[0]; // /lockgroup বা /unlockgroup

  if (command === "lockgroup") {
    lockStatus[threadID] = true;
    return api.sendMessage("🔒 গ্রুপ এখন লক করা হয়েছে (শুধু অ্যাডমিন লিখতে পারবে)", threadID);
  }

  if (command === "unlockgroup") {
    lockStatus[threadID] = false;
    return api.sendMessage("🔓 গ্রুপ আনলক করা হয়েছে (সবাই লিখতে পারবে)", threadID);
  }

  if (command === "statusgroup") {
    let status = lockStatus[threadID] ? "🔒 লক করা আছে" : "🔓 আনলক করা আছে";
    return api.sendMessage(`📌 গ্রুপের স্ট্যাটাস: ${status}`, threadID);
  }
};

// নন-অ্যাডমিন মেসেজ পাঠালে ব্লক করার সিস্টেম
module.exports.handleEvent = async function ({ api, event }) {
  const threadID = event.threadID;
  const senderID = event.senderID;

  if (lockStatus[threadID]) {
    const threadInfo = await api.getThreadInfo(threadID);
    const isAdmin = threadInfo.adminIDs.some(e => e.id == senderID);

    if (!isAdmin) {
      return api.unsendMessage(event.messageID); // নন-অ্যাডমিন মেসেজ ডিলিট করবে
    }
  }
};
