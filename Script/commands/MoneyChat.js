const fs = require("fs");
const path = __dirname + "/cache/money.json";

// টাকা লোড ফাংশন
function loadMoney() {
    if (!fs.existsSync(path)) return {};
    return JSON.parse(fs.readFileSync(path));
}

// টাকা সেভ ফাংশন
function saveMoney(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

// মেসেজ কাউন্টার লোড
const counterPath = __dirname + "/cache/messageCounter.json";
function loadCounter() {
    if (!fs.existsSync(counterPath)) return {};
    return JSON.parse(fs.readFileSync(counterPath));
}
function saveCounter(data) {
    fs.writeFileSync(counterPath, JSON.stringify(data, null, 2));
}

module.exports.config = {
    name: "moneychat",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "CYBER ☢️ BOT TEAM (Modified by ChatGPT)",
    description: "Earn money by chatting and bet system",
    commandCategory: "fun",
    usages: "/money | /bet [amount]",
    cooldowns: 3
};

let userBalance = loadMoney();       // ইউজারের টাকা
let messageCounter = loadCounter();  // ইউজারের মেসেজ কাউন্টার

const MESSAGE_REWARD = 5;       // প্রতি মেসেজে টাকা
const NOTICE_THRESHOLD = 20;    // প্রতি ২০ মেসেজে নোটিশ

module.exports.run = async function ({ api, event, args }) {
    const { threadID, senderID } = event;

    if (!userBalance[senderID]) userBalance[senderID] = 1000;
    if (!messageCounter[senderID]) messageCounter[senderID] = 0;

    const command = args[0] ? args[0].toLowerCase() : "check";

    // /money
    if (command === "check" || command === "money") {
        return api.sendMessage(
            `💰 আপনার বর্তমান টাকা: ${userBalance[senderID]} ৳`,
            threadID
        );
    }

    return api.sendMessage(
        "ℹ️ ব্যবহার করুন:\n/money → টাকা দেখুন\n/bet [amount] → Bet করুন",
        threadID
    );
};

// মেসেজে টাকা অ্যাড + নোটিশ + বেট
module.exports.handleEvent = async function ({ api, event }) {
    const { senderID, threadID, body } = event;
    if (!body) return;

    if (!userBalance[senderID]) userBalance[senderID] = 1000;
    if (!messageCounter[senderID]) messageCounter[senderID] = 0;

    // -------------------
    // /bet command
    const args = body.trim().split(" ");
    if (args[0].toLowerCase() === "/bet") {
        const betAmount = parseInt(args[1]);
        if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
            return api.sendMessage("⚠️ সঠিকভাবে লিখুন, যেমন: /bet 200", threadID);
        }

        if (userBalance[senderID] < betAmount) {
            return api.sendMessage("❌ আপনার কাছে এত টাকা নেই!", threadID);
        }

        const win = Math.random() < 0.5;
        if (win) {
            userBalance[senderID] += betAmount;
            saveMoney(userBalance);
            return api.sendMessage(
                `✅ আপনি জিতেছেন! 🎉\n💰 নতুন টাকা: ${userBalance[senderID]} ৳`,
                threadID
            );
        } else {
            userBalance[senderID] -= betAmount;
            saveMoney(userBalance);
            return api.sendMessage(
                `❌ আপনি হেরে গেছেন! 😢\n💰 নতুন টাকা: ${userBalance[senderID]} ৳`,
                threadID
            );
        }
    }

    // -------------------
    // মেসেজে টাকা অ্যাড
    userBalance[senderID] += MESSAGE_REWARD;
    messageCounter[senderID] += 1;

    saveMoney(userBalance);
    saveCounter(messageCounter);

    // নোটিশ, প্রতি ২০ মেসেজে
    if (messageCounter[senderID] >= NOTICE_THRESHOLD) {
        api.sendMessage(
            `💰 @${senderID} আপনার একাউন্টে ${MESSAGE_REWARD * NOTICE_THRESHOLD} ৳ জমা হয়েছে!\n💰 মোট টাকা: ${userBalance[senderID]} ৳`,
            threadID,
            () => {},
            { mentions: [{ tag: "User", id: senderID }] }
        );
        messageCounter[senderID] = 0; // রিসেট
        saveCounter(messageCounter);
    }
};
