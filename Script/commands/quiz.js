module.exports.config = {
    name: "quiz",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Mohammad Akash",
    description: "কুইজ খেলে 100 Coins উপার্জন করুন",
    commandCategory: "game",
    usages: "/quiz",
    cooldowns: 2
};

const fs = require("fs");
const path = __dirname + "/moneyData.json";

// ডাটা লোড করার ফাংশন
function loadData() {
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    return JSON.parse(fs.readFileSync(path));
}

// ডাটা সেভ করার ফাংশন
function saveData(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

// কুইজ প্রশ্ন এবং উত্তর
const quizzes = [
    { q: "বাংলাদেশের রাজধানী কি?", a: "ঢাকা" },
    { q: "পৃথিবীর বৃহত্তম মহাসাগর কোনটি?", a: "প্রশান্ত মহাসাগর" },
    { q: "মানবদেহের সবচেয়ে বড় অঙ্গ কোনটি?", a: "চামড়া" },
    { q: "সূর্যের সবচেয়ে কাছের গ্রহ কোনটি?", a: "বুধ" },
    { q: "HTML এর পূর্ণরূপ কি?", a: "Hyper Text Markup Language" }
];

module.exports.run = async function({ api, event }) {
    const { senderID, threadID } = event;
    let data = loadData();

    // নতুন ইউজার হলে ডিফল্ট ব্যালেন্স
    if (!data[senderID]) data[senderID] = { balance: 0 };

    // র্যান্ডম কুইজ নির্বাচন
    const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];

    // কুইজ মেসেজ
    api.sendMessage(`❓ কুইজ: ${quiz.q}\nReply এই মেসেজের সাথে সঠিক উত্তর লিখে পাঠাও।`, threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
            type: "quiz",
            question: quiz.q,
            answer: quiz.a.toLowerCase(),
            author: senderID,
            messageID: info.messageID
        });
    });
};

module.exports.onReply = async function({ event, Reply, api }) {
    const { senderID, threadID, messageID, body } = event;

    if (Reply.type !== "quiz") return;
    if (senderID !== Reply.author) return api.sendMessage("❌ এই কুইজটি অন্য কারো জন্য।", threadID, messageID);

    const data = loadData();

    if (body.toLowerCase() === Reply.answer) {
        data[senderID].balance += 100; // সঠিক হলে 100 Coins অ্যাড
        saveData(data);
        api.sendMessage(`🎉 সঠিক উত্তর! তুমি পেয়েছ 100 Coins\n💰 বর্তমান ব্যালেন্স: ${data[senderID].balance} Coins`, threadID, messageID);
        global.GoatBot.onReply.delete(Reply.messageID);
    } else {
        api.sendMessage(`❌ ভুল উত্তর! আবার চেষ্টা করো।`, threadID, messageID);
    }
};
