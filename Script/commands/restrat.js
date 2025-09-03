module.exports.config = {
	name: "restart",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
	description: "Restart Bot",
	commandCategory: "system",
	usages: "",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const { threadID, messageID } = event;
	return api.sendMessage(`${global.config.BOTNAME} 🤖 𝐁𝐨𝐭 𝐢𝐬 𝐍𝐨𝐰 𝐑𝐞𝐬𝐭𝐚𝐫𝐭𝐢𝐧𝐠 🔄⚡
🟢 সিস্টেম রিবুট হচ্ছে…  
⏳ অনুগ্রহ করে অপেক্ষা করুন… ⌛
💾 ডেটা সেভ হচ্ছে… ✅...`, threadID, () => process.exit(1));
}
