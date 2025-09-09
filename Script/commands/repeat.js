module.exports.config = {
    name: "repeat",
    version: "1.2.0",
    hasPermssion: 0,
    credits: "Mohammad Akash",
    description: "Repeat text/emoji in wave style",
    commandCategory: "fun",
    usages: "/repeat [emoji/text] [lines]",
    cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID } = event;

    if (args.length === 0) {
        return api.sendMessage("⚠️ দয়া করে টেক্সট/ইমোজি দিন, যেমন: /repeat ☺️ 20", threadID);
    }

    const input = args[0];  
    let lines = parseInt(args[1]) || 10; // ডিফল্ট 10 লাইন

    if (lines < 5) lines = 5;   // মিনিমাম ৫ লাইন
    if (lines > 50) lines = 50; // ম্যাক্স ৫০ লাইন (স্প্যাম ঠেকাতে)

    let art = "";
    const space = " ";

    // ওয়েভ আপ
    for (let i = 0; i < lines; i++) {
        art += space.repeat(i * 2) + input + "\n";
    }

    // ওয়েভ ডাউন
    for (let i = lines; i >= 0; i--) {
        art += space.repeat(i * 2) + input + "\n";
    }

    api.sendMessage(art, threadID);
};
