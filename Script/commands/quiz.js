const fs = require("fs");
const path = __dirname + "/quizData.json"; // কুইজ JSON ফাইল
const moneyPath = __dirname + "/moneyData.json"; // ইউজারের টাকা JSON

module.exports.config = {
    name: "quiz",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Mohammad Akash",
    description: "কুইজ খেলো এবং টাকা জিতে যাও",
    commandCategory: "game",
    usages: "/quiz",
    cooldowns: 2
};

// কুইজ ডাটা লোড
function loadQuiz() {
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(path));
}

// ইউজার ডাটা লোড
function loadData() {
    if (!fs.existsSync(moneyPath)) fs.writeFileSync(moneyPath, JSON.stringify({}));
    return JSON.parse(fs.readFileSync(moneyPath));
}
function saveData(data) {
    fs.writeFileSync(moneyPath, JSON.stringify(data, null, 2));
}

module.exports.run = async function({ api, event }) {
    const { senderID, threadID } = event;

    let data = loadData();
    if (!data[senderID]) data[senderID] = { balance: 0 };

    const quizzes = loadQuiz();
    if (quizzes.length === 0) return api.sendMessage("কোনো কুইজ নেই এখন 😢", threadID);

    // র্যান্ডম কুইজ
    const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];

    const quizMsg = `❓ কুইজ: ${randomQuiz.question}\n\n` +
                    `A) ${randomQuiz.a}\n` +
                    `B) ${randomQuiz.b}\n` +
                    `C) ${randomQuiz.c}\n` +
                    `D) ${randomQuiz.d}\n\n` +
                    `Reply এই মেসেজের সাথে শুধু A, B, C বা D লিখে পাঠাও।`;

    api.sendMessage(quizMsg, threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
            type: "quiz",
            author: senderID,
            messageID: info.messageID,
            correctAnswer: randomQuiz.answer.toUpperCase(), // A, B, C, D
            attempts: 0
        });
    });
};

// reply হ্যান্ডলিং
module.exports.onReply = async function({ event, Reply }) {
    const { senderID, messageID, threadID, body } = event;

    if (!Reply || Reply.type !== "quiz") return;

    if (senderID !== Reply.author) {
        return global.GoatBot.api.sendMessage("এই কুইজ তোমার জন্য 😡", threadID, messageID);
    }

    Reply.attempts += 1;
    const userAnswer = body.trim().toUpperCase(); // A, B, C, D

    if (userAnswer === Reply.correctAnswer) {
        let data = loadData();
        data[senderID].balance += 100; // সঠিক হলে ১০০ Coins অ্যাড
        saveData(data);

        global.GoatBot.api.sendMessage(
            `🎉 সঠিক উত্তর! 100 Coins পেয়েছো।\n💰 নতুন বেলেন্স: ${data[senderID].balance}`,
            threadID,
            messageID
        );
        global.GoatBot.onReply.delete(messageID);

    } else if (Reply.attempts >= 2) {
        global.GoatBot.api.sendMessage(
            `❌ ভুল উত্তর। সঠিক উত্তর: ${Reply.correctAnswer}`,
            threadID,
            messageID
        );
        global.GoatBot.onReply.delete(messageID);

    } else {
        global.GoatBot.api.sendMessage(
            `❌ ভুল উত্তর। ১ বার চেষ্টা বাকি। আবার চেষ্টা করো।`,
            threadID,
            messageID
        );
        global.GoatBot.onReply.set(messageID, Reply);
    }
};
