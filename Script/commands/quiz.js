const axios = require("axios");
const money = require("./money.js"); // money.js ফাইল import

const baseApiUrl = async () => {
  const res = await axios.get(
    "https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json"
  );
  return res.data.api;
};

module.exports = {
  config: {
    name: "quiz",
    aliases: ["qz"],
    version: "1.0",
    author: "Mohammad Akash",
    countDown: 0,
    role: 0,
    category: "game",
    guide: "/quiz [bn/en]",
  },

  onStart: async function({ api, event, usersData, args }) {
    const input = args.join("").toLowerCase() || "bn";
    const category = (input === "en" || input === "english") ? "english" : "bangla";
    const timeout = 300;

    try {
      const response = await axios.get(`${await baseApiUrl()}/quiz?category=${category}&q=random`);
      const quizData = response.data.question;
      const { question, correctAnswer, options } = quizData;
      const { a, b, c, d } = options;
      const namePlayer = await usersData.getName(event.senderID);

      const quizMsg = {
        body: `\n╭──✦ ${question}\n├‣ A) ${a}\n├‣ B) ${b}\n├‣ C) ${c}\n├‣ D) ${d}\n╰──────────────────‣\nReply with your answer!`,
      };

      api.sendMessage(quizMsg, event.threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          type: "reply",
          commandName: this.config.name,
          author: event.senderID,
          messageID: info.messageID,
          correctAnswer: correctAnswer.toLowerCase(),
          nameUser: namePlayer,
          attempts: 0,
        });
        setTimeout(() => {
          api.unsendMessage(info.messageID).catch(() => {});
        }, timeout * 1000);
      }, event.messageID);

    } catch (error) {
      console.error(error);
      api.sendMessage("❌ Error fetching quiz.", event.threadID, event.messageID);
    }
  },

  onReply: async function({ event, api, Reply, usersData }) {
    const { correctAnswer, nameUser, author } = Reply;
    if (event.senderID !== author) return api.sendMessage("❌ This is not your quiz!", event.threadID, event.messageID);

    const maxAttempts = 2;
    const userReply = event.body.toLowerCase();

    if (Reply.attempts >= maxAttempts) {
      api.unsendMessage(Reply.messageID).catch(() => {});
      return api.sendMessage(`🚫 | ${nameUser}, max attempts reached!\nCorrect answer: ${correctAnswer}`, event.threadID, event.messageID);
    }

    if (userReply === correctAnswer) {
      api.unsendMessage(Reply.messageID).catch(() => {});

      // money.js থেকে 100 Coins অ্যাড করা
      const newBalance = money.addMoney(author, 100);

      api.sendMessage(`🎉 Congrats ${nameUser}! You earned 100 Coins 💰\n💰 New Balance: ${newBalance}`, event.threadID, event.messageID);
    } else {
      Reply.attempts += 1;
      global.GoatBot.onReply.set(Reply.messageID, Reply);
      api.sendMessage(`❌ Wrong answer. Attempts left: ${maxAttempts - Reply.attempts}`, event.threadID, event.messageID);
    }
  }
};
