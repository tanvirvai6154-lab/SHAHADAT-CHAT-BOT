module.exports.config = {
  name: "prefix",
  version: "1.0.0", 
  hasPermssion: 0,
  credits: "Shahadat SAHU",
  description: "Display the bot's prefix and owner info",
  commandCategory: "Information",
  usages: "",
  cooldowns: 5
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
  var { threadID, messageID, body } = event;
  if (!body) return;

  var dataThread = await Threads.getData(threadID);
  var data = dataThread.data || {};
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  const groupName = dataThread.threadInfo?.threadName || "Unnamed Group";

  const triggerWords = [
    "prefix", "mprefix", "mpre", "bot prefix", "what is the prefix", "bot name",
    "how to use bot", "bot not working", "bot is offline", "prefx", "prfix",
    "perfix", "bot not talking", "where is bot", "bot dead", "bots dead",
    "dấu lệnh", "daulenh", "what prefix", "freefix", "what is bot", "what prefix bot",
    "how use bot", "where are the bots", "where prefix"
  ];

  let lowerBody = body.toLowerCase();
  if (triggerWords.includes(lowerBody)) {
    return api.sendMessage(
`🤖🌟━━━━━━━━━━━━━━━━━🌟🤖
　　　『 𝐏𝐑𝐄𝐅𝐈𝐗 𝐈𝐍𝐅𝐎 𝐁𝐎𝐓 』
🤖🌟━━━━━━━━━━━━━━━━━🌟🤖

🛠 『 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 』
➤ 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲   : ─꯭─⃝‌‌𝐁𝐚𝐛𝐲 🤖
➤ 𝗕𝗼𝘁 𝗔𝗱𝗺𝗶𝗻 : Mohammad Akash 👑
➤ 𝗕𝗼𝘁 𝗣𝗿𝗲𝗳𝗶𝘅 : [ ${prefix} ]

📦 『 𝐁𝐎𝐗 𝐈𝐍𝐅𝐎 』
➤ 𝗕𝗼𝘅 𝗡𝗮𝗺𝗲   : ${groupName} 🏠
➤ 𝗕𝗼𝘅 𝗧𝗜𝗗     : ${threadID} 🆔
➤ 𝗕𝗼𝘅 𝗣𝗿𝗲𝗳𝗶𝘅 : ${prefix} ⚡

👤 『 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎 』
➤ 𝗢𝘄𝗻𝗲𝗿 𝗡𝗮𝗺𝗲 : Mohammad Akash 🔥
➤ 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸    : www.facebook.com/arakashiam 🌐
➤ 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿  : m.me/arakashiam 💬
➤ 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽    : https://wa.me/+8801933165880 📱

🤖🌟━━━━━━━━━━━━━━━━━🌟🤖
　　　　𝗧𝗵𝗮𝗻𝗸 𝗬𝗼𝘂 𝗙𝗼𝗿 𝗨𝘀𝗶𝗻𝗴! 💖
🤖🌟━━━━━━━━━━━━━━━━━🌟🤖`,
      threadID,
      null
    );
  }
};

module.exports.run = async ({ event, api }) => {
  return api.sendMessage("Type 'prefix' or similar to get the bot info.", event.threadID);
};
