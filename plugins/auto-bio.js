// ⿻ ⌜𝐌𝐑𝐔𝐍𝐊𝐍𝐎𝐖𝐍 𝐗 𝐆𝐑𝐀𝐘 𝐖𝐎𝐋𝐅 - Auto Bio Plugin with Config Toggle

const moment = require("moment-timezone");
const { cmd } = require("../command");
const config = require("../config");

const lifeQuotes = [
  "💖 The only way to do great work is to love what you do.",
  "🌟 Strive not to be a success, but rather to be of value.",
  "🧠 The mind is everything. What you think, you become.",
  "🚀 Believe you can and you're halfway there.",
  "🌌 The future belongs to those who believe in their dreams.",
  "⏳ It is never too late to be what you might have been.",
  "🔥 Make the iron hot by striking!",
  "🎨 The best way to predict the future is to create it.",
  "👣 The journey of a thousand miles begins with one step.",
  "😊 Happiness comes from your own actions.",
  "🖤 Always King In The Game.",
  "😏 I am the Artist Who Paints My Life.",
  "☸ I Am Believe In Karma."
];

let bioUpdateInterval = null;

cmd({
  pattern: "autobio",
  desc: "Enable or disable automatic bio updates with motivational quotes and time.",
  category: "system",
  react: "🧬",
  use: ".autobio",
  filename: __filename,
}, 
async (conn, mek, m, {
  from, sender, reply, isOwner
}) => {

  // 🔒 Block command if AUTO_BIO is disabled in config
  if (config.AUTO_BIO.toLowerCase() !== "true") {
    return reply("❌ Auto Bio system is disabled in config.");
  }

  // Optional: Owner-only check
  if (!isOwner) {
    return reply("⛔ Only the bot owner can use this command.");
  }

  // Function to update the bot's status bio
  const updateBio = async () => {
    try {
      const currentTime = moment().tz("Asia/Colombo").format("HH:mm:ss");
      const quote = lifeQuotes[Math.floor(Math.random() * lifeQuotes.length)];
      const newStatus = `✨📸 𝐊ɪɴɢ-𝐒ᴀɴᴅᴇꜱʜ-𝐌ᴅ 𝐈𝐬 𝐀ᴄᴛɪᴠᴇ 🟢 | ⏰ ${currentTime} 🇱🇰\n💬 ${quote}`;

      await conn.updateProfileStatus(newStatus);
      console.log("✅ Bio updated:", newStatus);
    } catch (err) {
      console.error("❌ Failed to update bio:", err.message);
    }
  };

  // Toggle logic
  if (bioUpdateInterval) {
    clearInterval(bioUpdateInterval);
    bioUpdateInterval = null;
    await reply("🛑 Auto bio updates have been stopped.");
  } else {
    await updateBio(); // Initial run
    bioUpdateInterval = setInterval(updateBio, 60000); // every 1 minute
    await reply("✅ Auto bio update enabled!\nBot bio will update every 1 minute with current time and quotes.");
  }
});
