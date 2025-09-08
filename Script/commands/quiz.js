module.exports.config = {
    name: "quiz",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "CYBER ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝐀𝐌_ ☢️",
    description: "Send a multiple-choice question (MCQ) in the group",
    commandCategory: "fun",
    usages: "/quiz",
    cooldowns: 5,
    dependencies: {}
};

module.exports.run = async function ({ api, event }) {
    const { threadID } = event;

    // Example Quiz - আপনি চাইলে একাধিক প্রশ্ন add করতে পারেন
    const quizList = [
        {
            question: "বাংলাদেশের রাজধানী কোনটি?",
            options: ["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা"],
            answer: "ঢাকা"
        },
        {
            question: "পৃথিবীর বৃহত্তম মহাসাগর কোনটি?",
            options: ["অ্যাটলান্টিক", "ইন্ডিয়ান", "প্যাসিফিক", "আর্টিক"],
            answer: "প্যাসিফিক"
        },
        {
            question: "HTML এর পূর্ণরূপ কী?",
            options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlink Text Mark Language", "None of these"],
            answer: "Hyper Text Markup Language"
        }
    ];

    // Random quiz select
    const quiz = quizList[Math.floor(Math.random() * quizList.length)];

    // Options format
    let optionsText = "";
    for (let i = 0; i < quiz.options.length; i++) {
        optionsText += `${i + 1}. ${quiz.options[i]}\n`;
    }

    // Send message
    const msg = `📝 *Quiz Time!*\n\n❓ ${quiz.question}\n\n${optionsText}\n💡 Correct Answer: ${quiz.answer}`;
    return api.sendMessage(msg, threadID);
};
