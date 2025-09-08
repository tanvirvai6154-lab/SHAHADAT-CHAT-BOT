const fs = require("fs");

module.exports.config = {
    name: "quiz",
    version: "1.3.0",
    hasPermssion: 0,
    credits: "CYBER ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝐀𝐌_ ☢️",
    description: "Interactive MCQ quiz in group with bot-style reply",
    commandCategory: "fun",
    usages: "/quiz",
    cooldowns: 5,
    dependencies: {}
};

// Memory to track ongoing quiz per thread
let activeQuizzes = {};        // threadID -> current quiz
let askedQuestions = {};       // threadID -> array of asked question indexes

// Quiz list
const quizList = [
    {
        question: "বাংলাদেশের রাজধানী কোনটি?",
        options: ["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা"],
        answer: 1
    },
    {
        question: "HTML এর পূর্ণরূপ কী?",
        options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlink Text Mark Language", "None of these"],
        answer: 1
    },
    {
        question: "পৃথিবীর বৃহত্তম মহাসাগর কোনটি?",
        options: ["অ্যাটলান্টিক", "ইন্ডিয়ান", "প্যাসিফিক", "আর্টিক"],
        answer: 3
    },
    {
        question: "JS কোন ধরনের প্রোগ্রামিং ভাষা?",
        options: ["Server-side", "Client-side", "Both", "None"],
        answer: 3
    }
];

module.exports.run = async function ({ api, event }) {
    const { threadID } = event;

    // Initialize askedQuestions for this thread
    if (!askedQuestions[threadID]) askedQuestions[threadID] = [];

    // Filter unasked questions
    const unasked = quizList.filter((_, index) => !askedQuestions[threadID].includes(index));

    if (unasked.length === 0) {
        api.sendMessage("🎉 সব প্রশ্ন শেষ! নতুন রাউন্ড শুরু করতে /quiz লিখুন।", threadID);
        askedQuestions[threadID] = []; // Reset
        return;
    }

    // Randomly select a question from unasked
    const randomIndex = Math.floor(Math.random() * unasked.length);
    const quiz = unasked[randomIndex];

    // Save question index as asked
    const quizIndex = quizList.indexOf(quiz);
    askedQuestions[threadID].push(quizIndex);

    // Save active quiz for reply checking
    activeQuizzes[threadID] = quiz;

    // Format options with bot-style
    let optionsText = "";
    for (let i = 0; i < quiz.options.length; i++) {
        optionsText += `▶️ ${i + 1}. ${quiz.options[i]}\n`;
    }

    const msg = `🌟━━━━━━━━━━━━━━━━━🌟
📝 𝐐𝐮𝐢𝐳 𝐓𝐢𝐦𝐞! 📝
🌟━━━━━━━━━━━━━━━━━🌟

❓ ${quiz.question}

${optionsText}
⚡ উত্তর দিতে শুধুমাত্র ১, ২, ৩, ৪ টাইপ করুন।`;

    return api.sendMessage(msg, threadID);
};

module.exports.handleEvent = async function ({ event, api }) {
    const { threadID, senderID, body } = event;

    if (!activeQuizzes[threadID]) return;

    const quiz = activeQuizzes[threadID];
    const answer = parseInt(body);

    if (!answer || answer < 1 || answer > 4) return;

    if (answer === quiz.answer) {
        api.sendMessage(`✅ @${senderID} সঠিক! স্বাগতম 🎉\n━━━━━━━━━━━━━━━━━`, threadID);
    } else {
        api.sendMessage(`❌ @${senderID} ভুল হইছে!\n💡 সঠিক উত্তর: ${quiz.answer}. ${quiz.options[quiz.answer - 1]}\n━━━━━━━━━━━━━━━━━`, threadID);
    }

    // Remove active quiz after answer
    delete activeQuizzes[threadID];
};
