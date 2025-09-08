const fs = require("fs");
const path = __dirname + "/cache/money.json";
const counterPath = __dirname + "/cache/messageCounter.json";
const dailyPath = __dirname + "/cache/daily.json";

// ------------------
// টাকা লোড/সেভ
function loadMoney() {
    if (!fs.existsSync(path)) return {};
    return JSON.parse(fs.readFileSync(path));
}
function saveMoney(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

// মেসেজ কাউন্টার লোড/সেভ
function loadCounter() {
    if (!fs.existsSync(counterPath)) return {};
    return JSON.parse(fs.readFileSync(counterPath));
}
function saveCounter(data) {
    fs.writeFileSync(counterPath, JSON.stringify(data, null, 2));
}

// ডেইলি লোড/সেভ
function loadDaily() {
    if (!fs.existsSync(dailyPath)) return {};
    return JSON.parse(fs.readFileSync(dailyPath));
}
function saveDaily(data) {
    fs.writeFileSync(dailyPath, JSON.stringify(data, null, 2));
}

// ------------------
module.exports.config = {
    name: "moneychat",
    version: "1.3.0",
    hasPermssion: 0,
    credits: "Mohammad Akash (Edited by ChatGPT)",
    description: "Earn money by chatting, bet, daily reward, dice, lottery",
    commandCategory: "fun",
    usages: "/money | /bet [amount] | /daily | /dice [amount] | /lottery [amount]",
    cooldowns: 3
};

let userBalance = loadMoney();
let messageCounter = loadCounter();
let dailyData = loadDaily();

const MESSAGE_REWARD = 5;
const NOTICE_THRESHOLD = 20;
const MULTIPLIERS = [2, 10, 20]; // bet
const DICE_MULTIPLIERS = [2, 3, 4, 5]; // dice
const DAILY_MIN = 100;
const DAILY_MAX = 500;

module.exports.run = async function ({ api, event, args }) {
    const { threadID, senderID } = event;
    if (!userBalance[senderID]) userBalance[senderID] = 1000;
    if (!dailyData[senderID]) dailyData[senderID] = 0;

    const command = args[0] ? args[0].toLowerCase() : "check";

    // -------------------
    // /money বা check
    if (command === "check" || command === "money") {
        return api.sendMessage(
            `💰 আপনার বর্তমান টাকা: ${userBalance[senderID]} ৳`,
            threadID
        );
    }

    // -------------------
    // /daily
    if (command === "daily") {
        const today = new Date().toDateString();
        if (dailyData[senderID] === today) {
            return api.sendMessage("⏰ আপনি আজকের ডেইলি রিওয়ার্ড পেয়েছেন, কাল আবার চেষ্টা করুন!", threadID);
        }

        const amount = Math.floor(Math.random() * (DAILY_MAX - DAILY_MIN + 1)) + DAILY_MIN;
        userBalance[senderID] += amount;
        dailyData[senderID] = today;

        saveMoney(userBalance);
        saveDaily(dailyData);

        return api.sendMessage(`🎁 Daily Reward: আপনি ${amount} ৳ পেয়েছেন! 💰 নতুন ব্যালান্স: ${userBalance[senderID]} ৳`, threadID);
    }

    // -------------------
    return api.sendMessage(
        "ℹ️ ব্যবহার করুন:\n/money → টাকা দেখুন\n/bet [amount] → Bet করুন\n/daily → Daily Reward\n/dice [amount] → Dice Game\n/lottery [amount] → Lottery",
        threadID
    );
};

// -------------------
// মেসেজ ইভেন্ট
module.exports.handleEvent = async function ({ api, event }) {
    const { senderID, threadID, body } = event;
    if (!body) return;

    if (!userBalance[senderID]) userBalance[senderID] = 1000;
    if (!messageCounter[senderID]) messageCounter[senderID] = 0;

    const args = body.trim().split(" ");

    // -------------------
    // /bet
    if (args[0].toLowerCase() === "/bet") {
        const betAmount = parseInt(args[1]);
        if (!betAmount || isNaN(betAmount) || betAmount <= 0) return api.sendMessage("⚠️ সঠিকভাবে লিখুন, যেমন: /bet 200", threadID);
        if (userBalance[senderID] < betAmount) return api.sendMessage("❌ আপনার কাছে এত টাকা নেই!", threadID);

        const chosenMultiplier = MULTIPLIERS[Math.floor(Math.random() * MULTIPLIERS.length)];
        const win = Math.random() < 0.5;
        let resultMessage = "";

        if (win) {
            const winAmount = betAmount * chosenMultiplier;
            userBalance[senderID] += winAmount;
            resultMessage = `
🎰 𝗖𝗔𝗦𝗜𝗡𝗢 𝗕𝗘𝗧 🎰
💵 Bet: ${betAmount} ৳
✨ Multiplier: ${chosenMultiplier}x
🏆 You Won: ${winAmount} ৳
💰 নতুন ব্যালান্স: ${userBalance[senderID]} ৳
            `;
        } else {
            userBalance[senderID] -= betAmount;
            resultMessage = `
🎰 𝗖𝗔𝗦𝗜𝗡𝗢 𝗕𝗘𝗧 🎰
💵 Bet: ${betAmount} ৳
⚠️ Multiplier: ${chosenMultiplier}x
❌ You Lost: ${betAmount} ৳
💰 নতুন ব্যালান্স: ${userBalance[senderID]} ৳
            `;
        }

        saveMoney(userBalance);
        return api.sendMessage(resultMessage, threadID);
    }

    // -------------------
    // /dice
    if (args[0].toLowerCase() === "/dice") {
        const diceBet = parseInt(args[1]);
        if (!diceBet || isNaN(diceBet) || diceBet <= 0) return api.sendMessage("⚠️ সঠিকভাবে লিখুন, যেমন: /dice 100", threadID);
        if (userBalance[senderID] < diceBet) return api.sendMessage("❌ আপনার কাছে এত টাকা নেই!", threadID);

        const diceRoll = Math.floor(Math.random() * 6) + 1;
        const multiplier = DICE_MULTIPLIERS[Math.floor(Math.random() * DICE_MULTIPLIERS.length)];
        const win = diceRoll > 3; // ৪,৫,৬ হলে জিতবে

        let diceMessage = `
🎲 Dice Roll: ${diceRoll}
💵 Bet: ${diceBet} ৳
Multiplier: ${multiplier}x
`;

        if (win) {
            const winAmount = diceBet * multiplier;
            userBalance[senderID] += winAmount;
            diceMessage += `🏆 You Won: ${winAmount} ৳\n💰 নতুন ব্যালান্স: ${userBalance[senderID]} ৳`;
        } else {
            userBalance[senderID] -= diceBet;
            diceMessage += `❌ You Lost: ${diceBet} ৳\n💰 নতুন ব্যালান্স: ${userBalance[senderID]} ৳`;
        }

        saveMoney(userBalance);
        return api.sendMessage(diceMessage, threadID);
    }

    // -------------------
    // /lottery
    if (args[0].toLowerCase() === "/lottery") {
        const lotteryBet = parseInt(args[1]);
        if (!lotteryBet || isNaN(lotteryBet) || lotteryBet <= 0) return api.sendMessage("⚠️ সঠিকভাবে লিখুন, যেমন: /lottery 100", threadID);
        if (userBalance[senderID] < lotteryBet) return api.sendMessage("❌ আপনার কাছে এত টাকা নেই!", threadID);

        const win = Math.random() < 0.2; // ২০% সুযোগ জেতার
        if (win) {
            const winAmount = lotteryBet * 10;
            userBalance[senderID] += winAmount;
            saveMoney(userBalance);
            return api.sendMessage(`🎟️ Lottery Result: 🎉 You Won ${winAmount} ৳! 💰 নতুন ব্যালান্স: ${userBalance[senderID]} ৳`, threadID);
        } else {
            userBalance[senderID] -= lotteryBet;
            saveMoney(userBalance);
            return api.sendMessage(`🎟️ Lottery Result: ❌ You Lost ${lotteryBet} ৳\n💰 নতুন ব্যালান্স: ${userBalance[senderID]} ৳`, threadID);
        }
    }

    // -------------------
    // মেসেজে টাকা অ্যাড
    userBalance[senderID] += MESSAGE_REWARD;
    messageCounter[senderID] += 1;
    saveMoney(userBalance);
    saveCounter(messageCounter);

    if (messageCounter[senderID] >= NOTICE_THRESHOLD) {
        api.sendMessage(
            `💰 @${senderID} আপনার একাউন্টে ${MESSAGE_REWARD * NOTICE_THRESHOLD} ৳ জমা হয়েছে!\n💰 মোট টাকা: ${userBalance[senderID]} ৳`,
            threadID,
            () => {},
            { mentions: [{ tag: "User", id: senderID }] }
        );
        messageCounter[senderID] = 0;
        saveCounter(messageCounter);
    }
};
