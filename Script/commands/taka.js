module.exports.config = {
    name: "taka",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "CYBER ☢️ BOT TEAM (Modified by ChatGPT)",
    description: "Balance system with earn and bet",
    commandCategory: "fun",
    usages: "/taka | /taka earn | /taka bet [amount]",
    cooldowns: 3
};

let userBalance = {};  // এখানে সব ইউজারের টাকা সেভ হবে

module.exports.run = async function ({ api, event, args }) {
    const { threadID, senderID } = event;
    const command = args[0] ? args[0].toLowerCase() : "check";

    if (!userBalance[senderID]) userBalance[senderID] = 1000; // default টাকা

    // /taka
    if (command === "check" || command === "taka") {
        return api.sendMessage(
            `💰 আপনার বর্তমান টাকা: ${userBalance[senderID]} ৳`,
            threadID
        );
    }

    // /taka earn
    if (command === "earn") {
        const earnAmount = Math.floor(Math.random() * 401) + 100; // 100-500
        userBalance[senderID] += earnAmount;
        return api.sendMessage(
            `🎉 আপনি ${earnAmount} ৳ Earn করেছেন!\n💰 নতুন টাকা: ${userBalance[senderID]} ৳`,
            threadID
        );
    }

    // /taka bet
    if (command === "bet") {
        const betAmount = parseInt(args[1]);

        if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
            return api.sendMessage("⚠️ দয়া করে সঠিক পরিমাণ দিন, যেমন: /taka bet 200", threadID);
        }

        if (userBalance[senderID] < betAmount) {
            return api.sendMessage("❌ আপনার কাছে এত টাকা নেই!", threadID);
        }

        const win = Math.random() < 0.5; // ৫০% সুযোগ
        if (win) {
            userBalance[senderID] += betAmount;
            return api.sendMessage(
                `✅ আপনি জিতেছেন! 🎉\n💰 নতুন টাকা: ${userBalance[senderID]} ৳`,
                threadID
            );
        } else {
            userBalance[senderID] -= betAmount;
            return api.sendMessage(
                `❌ আপনি হেরে গেছেন! 😢\n💰 নতুন টাকা: ${userBalance[senderID]} ৳`,
                threadID
            );
        }
    }

    // যদি কিছু না মিলে
    return api.sendMessage(
        "ℹ️ ব্যবহার করুন:\n/taka → টাকা দেখুন\n/taka earn → টাকা Earn করুন\n/taka bet [amount] → Bet করুন",
        threadID
    );
};
