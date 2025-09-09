module.exports.config = {
    name: "calc",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Mohammad Akash",
    description: "Calculator system (যোগ, বিয়োগ, গুন, ভাগ ইত্যাদি)",
    commandCategory: "utility",
    usages: "/calc [expression]",
    cooldowns: 2
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID } = event;
    let expression = args.join(" ");

    if (!expression) {
        return api.sendMessage("⚠️ দয়া করে অংক লিখুন, যেমন: /calc 20+20", threadID);
    }

    try {
        // ÷ কে / এ কনভার্ট করা
        expression = expression.replace(/÷/g, "/");
        // × কে * এ কনভার্ট করা
        expression = expression.replace(/×/g, "*");

        // নিরাপদে হিসাব করার জন্য eval এর বদলে Function ব্যবহার করা হলো
        const result = Function(`"use strict"; return (${expression})`)();
        api.sendMessage(`🧮 ফলাফল: ${result}`, threadID);
    } catch (e) {
        api.sendMessage("❌ ভুল অংক দিয়েছেন! সঠিকভাবে লিখুন।", threadID);
    }
};
