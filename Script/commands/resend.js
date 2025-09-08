const fs = require("fs-extra");
const axios = require("axios");

// ADMINS Array - এখানে আপনার FB UID বসানো হয়েছে
const ADMINS = ["100078049308655"];

module.exports.config = {
    name: "resend",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "CYBER ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝐀𝐌_ ☢️",
    description: "Auto resend removed messages to admin inbox",
    commandCategory: "general",
    usages: "",
    cooldowns: 0,
    hide: true,
    dependencies: { "fs-extra": "", axios: "" }
};

module.exports.handleEvent = async function ({ event, api, Users }) {
    const { threadID, messageID, senderID, body, attachments, type } = event;

    if (!global.logMessage) global.logMessage = new Map();
    if (!global.data.botID) global.data.botID = api.getCurrentUserID();

    const threadData = global.data.threadData.get(threadID) || {};
    if ((threadData.resend === undefined || threadData.resend !== false) && senderID !== global.data.botID) {

        if (type !== "message_unsend") {
            global.logMessage.set(messageID, { msgBody: body, attachment: attachments });
        }

        if (type === "message_unsend") {
            const msg = global.logMessage.get(messageID);
            if (!msg) return;

            const userName = await Users.getNameUser(senderID);

            let forwardText = `═════════════════════\n💬 মেসেজ আনসেন্ট হয়েছে!\n═════════════════════\n\n👤 ইউজার: @${userName}\n📝 মেসেজ: ${msg.msgBody || "No text"}\n🆔 Thread ID: ${threadID}\n═════════════════════`;

            // attachments handle
            let attachmentsList = [];
            if (msg.attachment && msg.attachment.length > 0) {
                let count = 0;
                for (const file of msg.attachment) {
                    count++;
                    const ext = file.url.substring(file.url.lastIndexOf(".") + 1);
                    const filePath = __dirname + `/cache/resend_${count}.${ext}`;
                    const fileData = (await axios.get(file.url, { responseType: "arraybuffer" })).data;
                    fs.writeFileSync(filePath, Buffer.from(fileData, "utf-8"));
                    attachmentsList.push(fs.createReadStream(filePath));
                }
            }

            // send to all admins
            for (const adminID of ADMINS) {
                api.sendMessage(
                    { body: forwardText, attachment: attachmentsList.length ? attachmentsList : undefined, mentions: [{ tag: userName, id: senderID }] },
                    adminID
                );
            }
        }
    }
};

module.exports.languages = {
    vi: { on: "Bật", off: "Tắt", successText: "resend thành công" },
    en: { on: "on", off: "off", successText: "resend success!" }
};

module.exports.run = async function ({ api, event, Threads, getText }) {
    const { threadID, messageID } = event;
    let data = (await Threads.getData(threadID)).data || {};

    data.resend = !data.resend;
    await Threads.setData(threadID, { data });
    global.data.threadData.set(threadID, data);

    return api.sendMessage(`${data.resend ? getText("on") : getText("off")} ${getText("successText")}`, threadID, messageID);
};
