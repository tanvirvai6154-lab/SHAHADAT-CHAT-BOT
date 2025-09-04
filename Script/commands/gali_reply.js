const fs = require("fs");
module.exports.config = {
	name: "gali",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️", 
	description: "no prefix",
	commandCategory: "no prefix",
	usages: "abal",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("akash Bokasoda")==0 || event.body.indexOf("Akash mc")==0 || event.body.indexOf("chod")==0 || event.body.indexOf("akash nodir pola")==0 || event.body.indexOf("bc")==0 || event.body.indexOf("akash re chudi")==0 || event.body.indexOf("akash re chod")==0 || event.body.indexOf("akash Abal")==0 || event.body.indexOf("akash Boakachoda")==0 || event.body.indexOf("akash madarchod")==0 || event.body.indexOf("akash re chudi")==0 || event.body.indexOf("Akash Bokachoda")==0) {
		var msg = {
				body: "তোর মতো বোকাচোদা রে আমার বস আকাশ চু*দা বাদ দিছে🤣\nসাহু এখন আর hetars চুষে না🥱😈",
			}
			api.sendMessage(msg, threadID, messageID);
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
