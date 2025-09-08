module.exports.config = {
    name: "quiz",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "CYBER ☢️ BOT TEAM (Modified by ChatGPT)",
    description: "Generate unique random quiz question every time",
    commandCategory: "fun",
    usages: "/quiz",
    cooldowns: 3
};

let activeQuizzes = {};        
let usedQuestions = {};       

// Dynamic question bank
const questionBank = [
    { q: "বাংলাদেশের স্বাধীনতা কোন সালে অর্জিত হয়?", opts: ["১৯৭১", "১৯৬৫", "১৯৫২", "১৯৪৭"], a: 1 },
    { q: "বিশ্বের সবচেয়ে বড় দেশ কোনটি?", opts: ["রাশিয়া", "চীন", "কানাডা", "আমেরিকা"], a: 1 },
    { q: "পৃথিবীর নিকটতম গ্রহ কোনটি?", opts: ["মঙ্গল", "শুক্র", "বৃহস্পতি", "শনি"], a: 2 },
    { q: "Who is known as the Father of Computer?", opts: ["Charles Babbage", "Alan Turing", "Bill Gates", "Steve Jobs"], a: 1 },
    { q: "বাংলাদেশের জাতীয় পশু কোনটি?", opts: ["বাঘ", "হাতি", "রাজহাঁস", "ময়ূর"], a: 1 },
    { q: "2 + 2 × 2 = ?", opts: ["6", "8", "4", "10"], a: 1 },
    { q: "Which gas do plants absorb?", opts: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], a: 2 },
    { q: "পদ্মা সেতুর দৈর্ঘ্য কত?", opts: ["6.15 কিমি", "5 কিমি", "7.5 কিমি", "10 কিমি"], a: 1 }
];

module.exports.run = async function ({ api, event }) {
    const { threadID } = event;

    if (!usedQuestions[threadID]) usedQuestions[threadID] = [];

    // Filter out unused questions
    const unused = questionBank.filter((_, i) => !usedQuestions[threadID].includes(i));

    if (unused.length === 0) {
        return api.sendMessage("✅ সব প্রশ্ন শেষ হয়ে গেছে! (Reset হচ্ছে)", threadID, () => {
            usedQuestions[threadID] = []; // reset করে আবার নতুন শুরু
        });
    }

    // Pick random question
    const randomIndex = Math.floor(Math.random() * unused.length);
    const questionIndex = questionBank.indexOf(unused[randomIndex]);
    const quiz = questionBank[questionIndex];

    // Save for validation
    usedQuestions[threadID].push(questionIndex);
    activeQuizzes[threadID] = quiz;

    // Format message
    let optsText = "";
    quiz.opts.forEach((o, i) => {
        optsText += `➡️ ${i + 1}. ${o}\n`;
    });

    const msg = `🌟━━━━━━━━━━━━━━━🌟
📝 𝐐𝐮𝐢𝐳 𝐓𝐢𝐦𝐞!
🌟━━━━━━━━━━━━━━━🌟

❓ ${quiz.q}

${optsText}
⚡ উত্তর দিতে শুধু ১, ২, ৩, ৪ রিপ্লাই করুন।`;

    return api.sendMessage(msg, threadID);
};

module.exports.handleEvent = async function ({ event, api }) {
    const { threadID, body, senderID } = event;

    if (!activeQuizzes[threadID]) return;

    const quiz = activeQuizzes[threadID];
    const ans = parseInt(body);

    if (!ans || ans < 1 || ans > 4) return;

    if (ans === quiz.a) {
        api.sendMessage(
            `✅ সঠিক উত্তর! 🎉\nস্বাগতম @${senderID}`,
            threadID,
            () => {},
            { mentions: [{ tag: "User", id: senderID }] }
        );
    } else {
        api.sendMessage(
            `❌ ভুল উত্তর!\n💡 সঠিক উত্তর: ${quiz.a}. ${quiz.opts[quiz.a - 1]}`,
            threadID
        );
    }

    // Remove quiz after answered
    delete activeQuizzes[threadID];
};
