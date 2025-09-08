const fs = require("fs");

module.exports.config = {
    name: "quiz",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "CYBER ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝐀𝐌_ ☢️",
    description: "Interactive MCQ quiz in group with welcome on correct answer",
    commandCategory: "fun",
    usages: "/quiz",
    cooldowns: 5,
    dependencies: {}
};

// Temporary memory to track ongoing quiz
let activeQuizzes = {}; // threadID -> current quiz

module.exports.run = async function ({ api, event }) {
    const { threadID } = event;

    // Example quiz list
    const quizList = [
        {
            question: "বাংলাদেশের রাজধানী কোনটি?",
            options: ["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা"],
            answer: 1 // 1-based index
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
        }
    ];

    // Random quiz select
    const quiz = quizList[Math.floor(Math.random() * quizList.length)];

    // Save active quiz for thread
    activeQuizzes[threadID] = quiz;

    // Format options
    let optionsText = "";
    for (let i = 0; i < quiz.options.length; i++) {
        optionsText += `${i + 1}. ${quiz.options[i]}\n`;
    }

    const msg = `📝 *Quiz Time!*\n\n❓ ${quiz.question}\n\n${optionsText}\n⚡ উত্তর দিতে শুধুমাত্র ১, ২, ৩, ৪ টাইপ করুন।`;

    return api.sendMessage(msg, threadID);
};

// Event handler to check replies
module.exports.handleEvent = async function ({ event, api }) {
    const { threadID, senderID, body } = event;

    if (!activeQuizzes[threadID]) return;

    const quiz = activeQuizzes[threadID];
    const answer = parseInt(body);

    if (!answer || answer < 1 || answer > 4) return;

    if (answer === quiz.answer) {
        api.sendMessage(`✅ @${senderID} সঠিক! স্বাগতম 🎉`, threadID, (err, info) => {});
    } else {
        api.sendMessage(`❌ @${senderID} ভুল হইছে! সঠিক উত্তর হলো: ${quiz.answer}. ${quiz.options[quiz.answer - 1]}`, threadID, (err, info) => {});
    }

    // Remove quiz after answer
    delete activeQuizzes[threadID];
};
