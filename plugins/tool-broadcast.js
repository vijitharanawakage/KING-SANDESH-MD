const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

cmd({
  pattern: "broadcast",
  category: "group",
  desc: "Bot makes a broadcast in all groups",
  filename: __filename,
  use: "<text for broadcast.>"
}, async (conn, mek, m, { q, isGroup, isAdmins, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");
    if (!isAdmins) return reply("❌ You need to be an admin to broadcast in this group!");

    if (!q) return reply("❌ Provide text to broadcast in all groups!");

    let allGroups = await conn.groupFetchAllParticipating();
    let groupIds = Object.keys(allGroups); // Extract group IDs

    reply(`📢 𝐒ᴇɴᴅɪɴ𝐆 𝐁ʀᴏᴀᴅᴄᴀꜱ𝐓 𝐓𝐎 ${groupIds.length} 𝐆ʀᴏᴜᴘ𝐒...\n⏳ 𝐄ꜱᴛɪᴍᴀᴛᴇ𝐃 𝐓ɪᴍ𝐄: ${groupIds.length * 1.5} 𝐒ᴇᴄᴏɴᴅ𝐒`);

    for (let groupId of groupIds) {
      try {
        await sleep(1500); // Avoid rate limits
        await conn.sendMessage(groupId, { text: q }); // Sends only the provided text
      } catch (err) {
        console.log(`❌ Failed to send broadcast to ${groupId}:`, err);
      }
    }

    return reply(`✅ 𝐒ᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ 𝐒ᴇɴᴅ 𝐁ʀᴏᴀᴅᴄᴀꜱᴛ 𝐓ᴏ ${groupIds.length} 𝐆ʀᴏᴜᴘꜱ..!`);
    
  } catch (err) {
    await m.error(`❌ Error: ${err}\n\nCommand: broadcast`, err);
  }
});
