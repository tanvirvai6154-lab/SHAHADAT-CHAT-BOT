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
 ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ
⚠️𝚂𝚢𝚜𝚝𝚎𝚖 𝚆𝚘𝚛𝚔𝚒𝚗𝚐 𝙽𝚘𝚠...
𝚁𝚎𝚋𝚘𝚘𝚝𝚒𝚗𝚐 [■□□□□] 20%
𝚁𝚎𝚋𝚘𝚘𝚝𝚒𝚗𝚐 [■■□□□] 40%
𝚁𝚎𝚋𝚘𝚘𝚝𝚒𝚗𝚐 [■■■□□] 60%
𝚁𝚎𝚋𝚘𝚘𝚝𝚒𝚗𝚐 [■■■■□] 80%
𝚁𝚎𝚋𝚘𝚘𝚝𝚒𝚗𝚐[■■■■■] 100%
𝙵𝚒𝚗𝚊𝚕𝚢 𝙱𝚘𝚝 𝚁𝚎𝚜𝚝𝚊𝚛𝚝𝚎𝚍 ✔︎`, threadID, () => process.exit(1));
}
