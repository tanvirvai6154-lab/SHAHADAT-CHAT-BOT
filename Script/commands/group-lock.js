// group-lock.js // Blocks members (non-admins) from sending messages when group is locked. // Place this file in modules/commands/

const fs = require("fs"); const path = require("path");

module.exports.config = { name: "group", version: "1.0.1", hasPermssion: 0, credits: "Akash", description: "Group lock system - only admins can speak when locked", commandCategory: "admin", usages: "group lock | group unlock | group status", cooldowns: 5 };

const dataFile = path.join(__dirname, "groupLock.json"); let lockData = {};

function loadData() { try { if (fs.existsSync(dataFile)) { lockData = JSON.parse(fs.readFileSync(dataFile, "utf8")); } else { lockData = {}; } } catch (e) { console.error("Failed to load group lock data:", e); lockData = {}; } }

function saveData() { try { fs.writeFileSync(dataFile, JSON.stringify(lockData, null, 2), "utf8"); } catch (e) { console.error("Failed to save group lock data:", e); } }

// helper: check if user is admin in thread function isAdmin(api, threadID, userID) { return new Promise((resolve) => { try { api.getThreadInfo(threadID, (err, info) => { if (err || !info) return resolve(false); let admins = []; if (Array.isArray(info.adminIDs)) admins = info.adminIDs.map(a => typeof a === 'object' && a.id ? a.id : a); resolve(admins.includes(String(userID))); }); } catch (e) { resolve(false); } }); }

module.exports.onLoad = function() { loadData(); console.log("✅ group-lock module loaded."); };

// intercept messages and block non-admins when locked module.exports.onMessage = async function({ api, event }) { try { const threadID = event.threadID; const senderID = event.senderID;

if (!event.isGroup) return;

if (!lockData[threadID] || lockData[threadID] !== true) return; // not locked

const botID = api.getCurrentUserID ? api.getCurrentUserID() : null;
if (String(senderID) === String(botID)) return;

const admin = await isAdmin(api, threadID, senderID);
if (admin) return; // admin can speak

// remove the user's message immediately
try {
  if (event.messageID && typeof api.unsendMessage === 'function') {
    api.unsendMessage(event.messageID);
  } else if (event.messageID && typeof api.deleteMessage === 'function') {
    api.deleteMessage(event.messageID);
  }
} catch (e) {
  // ignore if unsend not allowed
}

// no warning message (silent block)
return;

} catch (e) { console.error('group-lock onMessage error:', e); } };

module.exports.run = async function({ api, event, args }) { const threadID = event.threadID; const senderID = event.senderID; const sub = args[0] ? args[0].toLowerCase() : "";

const youAreAdmin = await isAdmin(api, threadID, senderID); if (!youAreAdmin) return api.sendMessage("❌ এই কমান্ড ব্যবহার করার জন্য আপনাকে গ্রুপ অ্যাডমিন হতে হবে।", threadID);

if (sub === "lock") { lockData[threadID] = true; saveData(); return api.sendMessage("🔒 গ্রুপ লক করা হয়েছে — শুধুমাত্র অ্যাডমিনরা মেসেজ করতে পারবে।", threadID); }

if (sub === "unlock") { lockData[threadID] = false; saveData(); return api.sendMessage("🔓 গ্রুপ আনলক করা হয়েছে — সবাই মেসেজ করতে পারবে।", threadID); }

if (sub === "status") { const status = lockData[threadID] ? 'লক করা আছে 🔒' : 'আনলক করা আছে 🔓'; return api.sendMessage(📌 বর্তমান স্ট্যাটাস: ${status}, threadID); }

const help = 🛠️ গ্রুপ লক কমান্ড ব্যবহার:\n\n• group lock — গ্রুপ লক করবে (অ্যাডমিন ছাড়া কেউ মেসেজ করতে পারবে না)\n• group unlock — গ্রুপ আনলক করবে\n• group status — বর্তমান স্ট্যাটাস দেখাবে;

return api.sendMessage(help, threadID); };

