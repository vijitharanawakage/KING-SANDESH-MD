const fs = require("fs");
const config = require("../config");
const { cmd, commands } = require("../command");
const path = require('path');
const axios = require("axios");


cmd({
    pattern: "privacy",
    alias: ["privacymenu"],
    desc: "Privacy settings menu",
    category: "privacy",
    react: "🔐",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let privacyMenu = `╭━━〔 *♠ 𝐏ʀɪᴠᴀᴄ𝐘 𝐒ᴇᴛᴛɪɴɢ𝐒* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• 𝚋𝚕𝚘𝚌𝚔𝚕𝚒𝚜𝚝 - View blocked users
┃◈┃• 𝚐𝚎𝚝𝚋𝚒𝚘 - Get user's bio
┃◈┃• 𝚜𝚎𝚝𝚙𝚙𝚊𝚕𝚕 - Set profile pic privacy
┃◈┃• 𝚜𝚎𝚝𝚘𝚗𝚕𝚒𝚗𝚎 - Set online privacy
┃◈┃• 𝚜𝚎𝚝𝚙𝚙 - Change bot's profile pic
┃◈┃• 𝚜𝚎𝚝𝚖𝚢𝚗𝚊𝚖𝚎 - Change bot's name
┃◈┃• 𝚞𝚙𝚍𝚊𝚝𝚎𝚋𝚒𝚘 - Change bot's bio
┃◈┃• 𝚐𝚛𝚘𝚞𝚙𝚜𝚙𝚛𝚒𝚟𝚊𝚌𝚢 - Set group add privacy
┃◈┃• 𝚐𝚎𝚝𝚙𝚛𝚒𝚟𝚊𝚌𝚢 - View current privacy settings
┃◈┃• 𝚐𝚎𝚝𝚙𝚙 - Get user's profile picture
┃◈┃
┃◈┃*𝐎ᴘᴛɪᴏɴꜱ 𝐅ᴏʀ 𝐏ʀɪᴠᴀᴄʏ 𝐂ᴏᴍᴍᴀɴᴅꜱ:*
┃◈┃• 𝚊𝚕𝚕 - Everyone
┃◈┃• 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 - My contacts only
┃◈┃• 𝚌𝚘𝚗𝚝𝚊𝚌𝚝_𝚋𝚕𝚊𝚌𝚔𝚕𝚒𝚜𝚝 - Contacts except blocked
┃◈┃• 𝚗𝚘𝚗𝚎 - Nobody
┃◈┃• 𝚖𝚊𝚝𝚌𝚑_𝚕𝚊𝚜𝚝_𝚜𝚎𝚎𝚗 - Match last seen
┃◈└───────────┈⊷
╰──────────────┈⊷
*𝙽𝙾𝚃𝙴:* 𝙼𝙾𝚂𝚃 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂 𝙰𝚁𝙴 𝙾𝚆𝙽𝙴𝚁-𝙾𝙽𝙻𝚈 ✋.`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/m5drmn.png` }, // Replace with privacy-themed image if available
                caption: privacyMenu,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363402220977044@newsletter',
                        newsletterName: "♠ 𝐊ꜱᴍ𝐃 𝐏ʀɪᴠᴀᴄ𝐘 𝐒ᴇᴛᴛɪɴɢ𝐒",
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});


cmd({
    pattern: "blocklist",
    desc: "View the list of blocked users.",
    category: "privacy",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 You are not the owner!*");

    try {
        // Fetch the block list
        const blockedUsers = await conn.fetchBlocklist();

        if (blockedUsers.length === 0) {
            return reply("📋 Your block list is empty.");
        }

        // Format the blocked users with 📌 and count the total
        const list = blockedUsers
            .map((user, i) => `🚧 𝐁ʟᴏᴄᴋᴇ𝐃 ${user.split('@')[0]}`) // Remove domain and add 📌
            .join('\n');

        const count = blockedUsers.length;
        reply(`📋 𝐁ʟᴏᴄᴋᴇ𝐃 𝐔ꜱᴇʀ𝐒 (${count}):\n\n${list}`);
    } catch (err) {
        console.error(err);
        reply(`❌ Failed to fetch block list: ${err.message}`);
    }
});

cmd({
    pattern: "getbio",
    desc: "Displays the user's bio.",
    category: "privacy",
    filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
    try {
        const jid = args[0] || mek.key.remoteJid;
        const about = await conn.fetchStatus?.(jid);
        if (!about) return reply("No bio found.");
        return reply(`User Bio:\n\n${about.status}`);
    } catch (error) {
        console.error("Error in bio command:", error);
        reply("No bio found.");
    }
});
cmd({
    pattern: "setppall",
    desc: "Update Profile Picture Privacy",
    category: "privacy",
    react: "🔐",
    filename: __filename
}, 
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    
    try {
        const value = args[0] || 'all'; 
        const validValues = ['all', 'contacts', 'contact_blacklist', 'none'];  
        
        if (!validValues.includes(value)) {
            return reply("❌ Invalid option. Valid options are: 'all', 'contacts', 'contact_blacklist', 'none'.");
        }
        
        await conn.updateProfilePicturePrivacy(value);
        reply(`✅ 𝐏ʀᴏꜰɪʟᴇ 𝐏ɪᴄᴛᴜʀᴇ 𝐏ʀɪᴠᴀᴄʏ 𝐔ᴘᴅᴀᴛᴇᴅ 𝐓ᴏ: ${value}`);
    } catch (e) {
        return reply(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});
cmd({
    pattern: "setonline",
    desc: "Update Online Privacy",
    category: "privacy",
    react: "🔐",
    filename: __filename
}, 
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    try {
        const value = args[0] || 'all'; 
        const validValues = ['all', 'match_last_seen'];
        
        if (!validValues.includes(value)) {
            return reply("❌ Invalid option. Valid options are: 'all', 'match_last_seen'.");
        }

        await conn.updateOnlinePrivacy(value);
        reply(`✅ 𝐎ɴʟɪɴᴇ 𝐏ʀɪᴠᴀᴄʏ 𝐔ᴘᴅᴀᴛᴇᴅ 𝐓ᴏ: ${value}`);
    } catch (e) {
        return reply(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

cmd({
    pattern: "setpp",
    desc: "Set bot profile picture.",
    category: "privacy",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, quoted, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!quoted || !quoted.message.imageMessage) return reply("❌ Please reply to an image.");
    try {
        const stream = await downloadContentFromMessage(quoted.message.imageMessage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        const mediaPath = path.join(__dirname, `${Date.now()}.jpg`);
        fs.writeFileSync(mediaPath, buffer);

        // Update profile picture with the saved file
        await conn.updateProfilePicture(conn.user.jid, { url: `file://${mediaPath}` });
        reply("🖼️ 𝐏ʀᴏꜰɪʟᴇ 𝐏ɪᴄᴛᴜʀᴇ 𝐔ᴘᴅᴀᴛᴇᴅ 𝐒ᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ..!");
    } catch (error) {
        console.error("Error updating profile picture:", error);
        reply(`❌ Error updating profile picture: ${error.message}`);
    }
});

cmd({
    pattern: "setmyname",
    desc: "Set your WhatsApp display name.",
    category: "privacy",
    react: "⚙️",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply, args }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    // Ensure you have the display name argument
    const displayName = args.join(" ");
    if (!displayName) return reply("❌ Please provide a display name.");

    try {
        // Ensure the session is loaded before trying to update
        const { state, saveCreds } = await useMultiFileAuthState('path/to/auth/folder');
        const conn = makeWASocket({
            auth: state,
            printQRInTerminal: true,
        });

        conn.ev.on('creds.update', saveCreds);

        // Update display name after connection
        await conn.updateProfileName(displayName);
        reply(`✅ 𝐘ᴏᴜʀ 𝐃ɪꜱᴘʟᴀʏ 𝐍ᴀᴍᴇ 𝐇ᴀꜱ 𝐁ᴇᴇɴ 𝐒ᴇᴛ 𝐓ᴏ: ${displayName}`);
    } catch (err) {
        console.error(err);
        reply("❌ Failed to set your display name.");
    }
});

cmd({
    pattern: "updatebio",
    react: "🥏",
    desc: "Change the Bot number Bio.",
    category: "privacy",
    use: '.updatebio',
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isOwner) return reply('🚫 *You must be an Owner to use this command*');
        if (!q) return reply('❓ *Enter the New Bio*');
        if (q.length > 139) return reply('❗ *Sorry! Character limit exceeded*');
        await conn.updateProfileStatus(q);
        await conn.sendMessage(from, { text: "✔️ *𝐍ᴇᴡ 𝐁ɪᴏ 𝐀ᴅᴅᴇᴅ 𝐒ᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ*" }, { quoted: mek });
    } catch (e) {
        reply('🚫 *An error occurred!*\n\n' + e);
        l(e);
    }
});
cmd({
    pattern: "groupsprivacy",
    desc: "Update Group Add Privacy",
    category: "privacy",
    react: "🔐",
    filename: __filename
}, 
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    try {
        const value = args[0] || 'all'; 
        const validValues = ['all', 'contacts', 'contact_blacklist', 'none'];
        
        if (!validValues.includes(value)) {
            return reply("❌ Invalid option. Valid options are: 'all', 'contacts', 'contact_blacklist', 'none'.");
        }

        await conn.updateGroupsAddPrivacy(value);
        reply(`✅ 𝐆ʀᴏᴜᴘ 𝐀ᴅᴅ 𝐏ʀɪᴠᴀᴄʏ 𝐔ᴘᴅᴀᴛᴇ 𝐓ᴏ: ${value}`);
    } catch (e) {
        return reply(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

cmd({
    pattern: "getprivacy",
    desc: "Get the bot Number Privacy Setting Updates.",
    category: "privacy",
    use: '.getprivacy',
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isOwner) return reply('🚫 *You must be an Owner to use this command*');
        const duka = await conn.fetchPrivacySettings?.(true);
        if (!duka) return reply('🚫 *Failed to fetch privacy settings*');
        
        let puka = `
╭───「 𝐊ꜱᴍ𝐃 𝐏ʀɪᴠᴀᴄ𝐘 」───◆  
│ ∘ 𝚁𝚎𝚊𝚍 𝚁𝚎𝚌𝚎𝚒𝚙𝚝: ${duka.readreceipts}  
│ ∘ 𝙿𝚛𝚘𝚏𝚒𝚕𝚎 𝙿𝚒𝚌𝚝𝚞𝚛𝚎: ${duka.profile}  
│ ∘ 𝚂𝚝𝚊𝚝𝚞𝚜: ${duka.status}  
│ ∘ 𝙾𝚗𝚕𝚒𝚗𝚎: ${duka.online}  
│ ∘ 𝙻𝚊𝚜𝚝 𝚂𝚎𝚎𝚗: ${duka.last}  
│ ∘ 𝙶𝚛𝚘𝚞𝚙 𝙿𝚛𝚒𝚟𝚊𝚌𝚢: ${duka.groupadd}  
│ ∘ 𝙲𝚊𝚕𝚕 𝙿𝚛𝚒𝚟𝚊𝚌𝚢: ${duka.calladd}  
╰────────────────────`;
        await conn.sendMessage(from, { text: puka }, { quoted: mek });
    } catch (e) {
        reply('🚫 *An error occurred!*\n\n' + e);
        l(e);
    }
});
cmd({
    pattern: "getpp",
    desc: "Fetch the profile picture of a tagged or replied user.",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { quoted, isGroup, sender, participants, reply }) => {
    try {
        // Determine the target user
        const targetJid = quoted ? quoted.sender : sender;

        if (!targetJid) return reply("⚠️ Please reply to a message to fetch the profile picture.");

        // Fetch the user's profile picture URL
        const userPicUrl = await conn.profilePictureUrl(targetJid, "image").catch(() => null);

        if (!userPicUrl) return reply("⚠️ No profile picture found for the specified user.");

        // Send the user's profile picture
        await conn.sendMessage(m.chat, {
            image: { url: userPicUrl },
            caption: "🖼️ 𝐇ᴇʀᴇ 𝐈ꜱ 𝐓ʜᴇ 𝐏ʀᴏꜰɪʟᴇ 𝐏ɪᴄᴛᴜʀᴇ 𝐎ꜰ 𝐓ʜᴇ 𝐒ᴘᴇᴄɪꜰɪᴄ 𝐔ꜱᴇʀ."
        });
    } catch (e) {
        console.error("Error fetching user profile picture:", e);
        reply("❌ An error occurred while fetching the profile picture. Please try again later.");
    }
});

          
