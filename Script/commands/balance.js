module.exports.config = {
    name: "balance",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "CYBER ☢️ BOT TEAM (Modified by ChatGPT)",
    description: "Balance system with earn and bet",
    commandCategory: "fun",
    usages: "/balance | /earn | /bet [amount]",
    cooldowns: 3
};

let userBalance = {};  // এখানে সব ইউজারের বেলেন্স সেভ হবে

module.exports.run = async function ({ api, event, args }) {
    const { threadID, senderID, body } = event;
    const command = args[0] ? args[0].toLowerCase() : "check";

    if (!userBalance[senderID]) userBalance[senderID] = 1000; // default balance

    // /balance
    if (command === "check" || command === "balance") {
        return api.sendMessage(
            `💰 আপনার বর্তমান Balance: ${userBalance[senderID]} টাকা`,
            threadID
        );
    }

    // /earn
    if (command === "earn") {
        const earnAmount = Math.floor(Math.random() * 401) + 100; // 100-500
        userBalance[senderID] += earnAmount;
        return api.sendMessage(
            `🎉 আপনি ${earnAmount} টাকা Earn করেছেন!\n💰 নতুন Balance: ${userBalance[senderID]}`,
            threadID
        );
    }

    // /bet
    if (command === "bet") {
        const betAmount = parseInt(args[1]);

        if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
            return api.sendMessage("⚠️ দয়া করে সঠিক পরিমাণ দিন, যেমন: /bet 200", threadID);
        }

        if (userBalance[senderID] < betAmount) {
            return api.sendMessage("❌ আপনার Balance এ এত টাকা নেই!", threadID);
        }

        const win = Math.random() < 0.5; // ৫০% সুযোগ
        if (win) {
            userBalance[senderID] += betAmount;
            return api.sendMessage(
                `✅ আপনি জিতেছেন! 🎉\n💰 নতুন Balance: ${userBalance[senderID]}`,
                threadID
            );
        } else {
            userBalance[senderID] -= betAmount;
            return api.sendMessage(
                `❌ আপনি হেরে গেছেন! 😢\n💰 নতুন Balance: ${userBalance[senderID]}`,
                threadID
            );
        }
    }

    // যদি কিছু না মিলে
    return api.sendMessage(
        "ℹ️ ব্যবহার করুন:\n/balance → Balance দেখুন\n/earn → টাকা Earn করুন\n/bet [amount] → Bet করুন",
        threadID
    );
};
