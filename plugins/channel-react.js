const config = require('../config');
const { cmd } = require('../command');

const stylizedChars = {
    a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
    h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
    o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
    v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
    '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
    '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
};

cmd({
    pattern: "chr",
    alias: ["creact"],
    react: "🔤",
    desc: "React to channel messages with stylized text",
    category: "owner",
    use: '.chr <channel-link> <text>',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isCreator) return reply("❌ Owner only command");
        if (!q) return reply(`Usage:\n${command} https://whatsapp.com/channel/1234567890 hello`);

        const [link, ...textParts] = q.split(' ');
        if (!link.includes("whatsapp.com/channel/")) return reply("Invalid channel link format");
        
        const inputText = textParts.join(' ').toLowerCase();
        if (!inputText) return reply("Please provide text to convert");

        const emoji = inputText
            .split('')
            .map(char => {
                if (char === ' ') return '―';
                return stylizedChars[char] || char;
            })
            .join('');

        const channelId = link.split('/')[4];
        const messageId = link.split('/')[5];
        if (!channelId || !messageId) return reply("Invalid link - missing IDs");

        const channelMeta = await conn.newsletterMetadata("invite", channelId);
        await conn.newsletterReactMessage(channelMeta.id, messageId, emoji);

        return reply(`╭━━━〔 *𝐊ɪɴɢ 𝐒ᴀɴᴅᴇꜱʜ 𝐌ᴅ 𝐑ᴇᴀᴄᴛɪᴏɴ 𝐒ʏꜱᴛᴇᴍ* 〕━━━┈⊷
┃▸ *𝚂𝚄𝙲𝙲𝙴𝚂𝚂!* Reaction sent
┃▸ *𝙲𝙷𝙰𝙽𝙽𝙴𝙻:* ${channelMeta.name}
┃▸ *𝚁𝙴𝙰𝙲𝚃𝙸𝙾𝙽:* ${emoji}
╰────────────────┈⊷
> *© Powered By King-Sandesh-Md V2 💸*`);
    } catch (e) {
        console.error(e);
        reply(`❎ Error: ${e.message || "Failed to send reaction"}`);
    }
});

