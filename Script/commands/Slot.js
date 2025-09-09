const fs = require("fs");
const path = __dirname + "/moneyData.json";

function loadData() {
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    return JSON.parse(fs.readFileSync(path));
}

function saveData(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports.config = {
    name: "slot",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Mohammad Akash",
    description: "🎰 Slot machine game",
    commandCategory: "game",
    usages: "/slot [amount]",
    cooldowns: 2
};

module.exports.run = async function({ api, event, args }) {
    const { senderID, threadID } = event;
    const data = loadData();

    if (!data[senderID]) data[senderID] = { balance: 1000 }; // নতুন ইউজারের ডিফল্ট ব্যালেন্স

    const bet = parseInt(args[0]);
    if (isNaN(bet) || bet <= 0) {
        return api.sendMessage("🔴 𝗘𝗥𝗥𝗢𝗥: সঠিক amount লিখো! যেমন: /slot 100", threadID);
    }

    if (data[senderID].balance < bet) {
        return api.sendMessage(`🔴 𝗜𝗡𝗦𝗨𝗙𝗙𝗜𝗖𝗜𝗘𝗡𝗧 𝗙𝗨𝗡𝗗𝗦: তোমার কাছে ${bet} Coins নেই!`, threadID);
    }

    // Slot symbols & weighted random
    const symbols = [
        { emoji: "🍒", weight: 30 },
        { emoji: "🍋", weight: 25 },
        { emoji: "🍇", weight: 20 },
        { emoji: "🍉", weight: 15 },
        { emoji: "⭐", weight: 7 },
        { emoji: "7️⃣", weight: 3 }
    ];

    const roll = () => {
        const totalWeight = symbols.reduce((sum, s) => sum + s.weight, 0);
        let r = Math.random() * totalWeight;
        for (const s of symbols) {
            if (r < s.weight) return s.emoji;
            r -= s.weight;
        }
        return symbols[0].emoji;
    };

    const slot1 = roll(), slot2 = roll(), slot3 = roll();

    // Determine winnings
    let winnings = 0;
    let outcome = "";

    if (slot1 === "7️⃣" && slot2 === "7️⃣" && slot3 === "7️⃣") {
        winnings = bet * 10;
        outcome = "🔥 MEGA JACKPOT! Triple 7️⃣!";
    } else if (slot1 === slot2 && slot2 === slot3) {
        winnings = bet * 5;
        outcome = "💰 JACKPOT! 3 matching symbols!";
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
        winnings = bet * 2;
        outcome = "✨ NICE! 2 matching symbols!";
    } else if (Math.random() < 0.5) {
        winnings = bet * 1.5;
        outcome = "🎯 LUCKY SPIN! Bonus win!";
    } else {
        winnings = -bet;
        outcome = "💸 BETTER LUCK NEXT TIME!";
    }

    data[senderID].balance += winnings;
    saveData(data);

    // Send result
    const slotBox = 
        "╔═════════════════════╗\n" +
        "║  🎰 SLOT MACHINE 🎰  ║\n" +
        "╠═════════════════════╣\n" +
        `║     [ ${slot1} | ${slot2} | ${slot3} ]     ║\n` +
        "╚═════════════════════╝";

    const resultText = winnings >= 0 ? `🏆 WON: ${winnings} Coins` : `💸 LOST: ${bet} Coins`;

    const messageContent = 
        `${slotBox}\n\n` +
        `🎯 RESULT: ${outcome}\n` +
        `💰 BALANCE: ${data[senderID].balance} Coins`;

    api.sendMessage(messageContent, threadID);
};
