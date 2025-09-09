module.exports.config = {
    name: "baby",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "Mohammad Akash",
    description: "Conversation with baby style 💖",
    commandCategory: "fun",
    usages: "/baby",
    cooldowns: 3
};

let babyConversations = {};

module.exports.run = async function ({ api, event }) {
    const { threadID } = event;

    api.sendMessage("💖 হ্যাঁ বেবি, শুনতেছি বলো...", threadID, (err, info) => {
        if (!err) {
            babyConversations[threadID] = info.messageID; 
        }
    });
};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageReply, body } = event;
    if (!messageReply || !body) return;

    // চেক করবো যে রিপ্লাইটা বেবির মেসেজের রিপ্লাই কিনা
    if (babyConversations[threadID] && messageReply.messageID === babyConversations[threadID]) {
        const text = body.toLowerCase();
        let reply = "";

        if (text.includes("love")) reply = "🥰 আমিও তোমাকে ভালোবাসি বেবি 💖";
        else if (text.includes("miss")) reply = "😢 আমিও তোমাকে অনেক মিস করি...";
        else if (text.includes("koro")) reply = "🥺 তোমার কথাই ভাবি বেবি...";
        else if (text.includes("bye")) {
            reply = "😢 আচ্ছা বেবি, বাই...";
            delete babyConversations[threadID]; 
        } else {
            const replies = [
                "হুম বেবি, চালিয়ে যাও 🥰",
                "আহা! দারুণ বলছো 😍",
                "ওফফ তুমি না একদম কিউট 💖",
                "আরো বলো বেবি, আমি শুনতেছি 🥺",
                "আচ্ছা আচ্ছা, ঠিক আছে 😅"
            ];
            reply = replies[Math.floor(Math.random() * replies.length)];
        }

        // এবার রিপ্লাই আকারে রিপ্লাই করবে
        api.sendMessage(reply, threadID, (err, info) => {
            if (!err) {
                babyConversations[threadID] = info.messageID; // নতুন রিপ্লাই ট্র্যাক
            }
        });
    }
};
