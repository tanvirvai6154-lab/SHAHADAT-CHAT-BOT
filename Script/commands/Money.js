module.exports.config = {
    name: "money",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Mohammad Akash",
    description: "বেলেন্স দেখার কমান্ড",
    commandCategory: "Economy",
    usages: "/money",
    cooldowns: 2
};

const fs = require("fs");
const path = __dirname + "/moneyData.json";

// ফাংশন: ডাটা লোড করা
function loadData() {
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    return JSON.parse(fs.readFileSync(path));
}

// ফাংশন: ডাটা সেভ করা
function saveData(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports.run = async function({ api, event }) {
    const { senderID, threadID } = event;
    let data = loadData();

    // যদি নতুন ইউজার হয়, ডিফল্ট বেলেন্স 0
    if (!data[senderID]) data[senderID] = { balance: 0 };

    const balance = data[senderID].balance;
    api.sendMessage(`💰 তোমার বেলেন্স: ${balance} Coins`, threadID);
};
