const axios = require("axios");
const fs = require("fs");
const path = __dirname + "/moneyData.json";

// money.json লোড ও সেভ ফাংশন
function loadData() {
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    return JSON.parse(fs.readFileSync(path));
}
function saveData(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = {
    config: {
        name: "quiz",
        aliases: ["qz"],
        version: "1.0",
        author: "Mohammad Akash",
        countDown: 0,
        role: 0,
        category: "game",
        guide: "/quiz [bn/en]",
    },

    onStart: async function({ api, event, args }) {
        const input = args[0] ? args[0].toLowerCase() : "bn";
        const category = (input === "en" || input === "english") ? "english" : "bangla";

        try {
            // Random quiz question
            const res = await axios.get(`https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`);
            const baseApi = res.data.api;
            const quizRes = await axios.get(`${baseApi}/quiz?category=${category}&q=random`);
            const quizData = quizRes.data.question;
            const { question, correctAnswer, options } = quizData;
            const { a, b, c, d } = options;

            // Send quiz message
            api.sendMessage({
                body: `\n╭──✦ ${question}\n├‣ A) ${a}\n├‣ B) ${b}\n├‣ C) ${c}\n├‣ D) ${d}\n╰──────────────────‣\n𝚁𝚎𝚙𝚕𝚢 𝚠ith your answer.`,
            }, event.threadID, (err, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    type: "reply",
                    commandName: this.config.name,
                    author: event.senderID,
                    messageID: info.messageID,
                    correctAnswer: correctAnswer.toLowerCase(),
                    attempts: 0
                });
            }, event.messageID);

        } catch (err) {
            console.error(err);
            api.sendMessage("❌ Error fetching quiz.", event.threadID, event.messageID);
        }
    },

    onReply: async function({ event, api, Reply }) {
        const { correctAnswer, author } = Reply;
        if (event.senderID !== author) return api.sendMessage("❌ This is not your quiz!", event.threadID, event.messageID);

        const maxAttempts = 2;
        let userReply = event.body.toLowerCase();

        if (Reply.attempts >= maxAttempts) {
            api.unsendMessage(Reply.messageID).catch(console.error);
            return api.sendMessage(`🚫 Max attempts reached. Correct answer: ${correctAnswer}`, event.threadID, event.messageID);
        }

        if (userReply === correctAnswer) {
            api.unsendMessage(Reply.messageID).catch(console.error);

            // Add 100 Coins
            const data = loadData();
            if (!data[author]) data[author] = { balance: 0 };
            data[author].balance += 100;
            saveData(data);

            api.sendMessage(`🎉 Correct! You've earned 100 Coins!\n💰 New Balance: ${data[author].balance} Coins`, event.threadID, event.messageID);
        } else {
            Reply.attempts += 1;
            global.GoatBot.onReply.set(Reply.messageID, Reply);
            api.sendMessage(`❌ Wrong answer. Attempts left: ${maxAttempts - Reply.attempts}`, event.threadID, event.messageID);
        }
    }
};
