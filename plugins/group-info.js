const config = require('../config')
const { cmd } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep } = require('../lib/functions')

cmd({
    pattern: "ginfo",
    react: "🥏",
    alias: ["groupinfo"],
    desc: "Get group information.",
    category: "group",
    use: '.ginfo',
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, isCmd, isGroup, sender, isBotAdmins,
    isAdmins, isDev, reply, groupMetadata, participants
}) => {
    try {
        // Requirements
        if (!isGroup) return reply(`❌ This command only works in group chats.`);
        if (!isAdmins && !isDev) return reply(`⛔ Only *Group Admins* or *Bot Dev* can use this.`);
        if (!isBotAdmins) return reply(`❌ I need *admin* rights to fetch group details.`);

        const fallbackPpUrls = [
            'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
            'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
        ];
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(from, 'image');
        } catch {
            ppUrl = fallbackPpUrls[Math.floor(Math.random() * fallbackPpUrls.length)];
        }

        const metadata = await conn.groupMetadata(from);
        const groupAdmins = participants.filter(p => p.admin);
        const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
        const owner = metadata.owner || groupAdmins[0]?.id || "unknown";

        const gdata = `*「 Ｇʀᴏᴜᴘ Ｉɴꜰᴏ 」*\n
*𝙶𝚁𝙾𝚄𝙿 𝙽𝙰𝙼𝙴* : ${metadata.subject}
*𝙶𝚁𝙾𝚄𝙿 𝙸𝙳* : ${metadata.id}
*𝙿𝙰𝚁𝚃𝙸𝙲𝙸𝙿𝙰𝙽𝚃𝚂* : ${metadata.size}
*𝙶𝚁𝙾𝚄𝙿 𝙲𝚁𝙴𝙰𝚃𝙾𝚁* : @${owner.split('@')[0]}
*𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽* : ${metadata.desc?.toString() || 'No description'}\n
*𝙰𝙳𝙼𝙸𝙽𝚂 (${groupAdmins.length})*:\n${listAdmin}`

        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: gdata,
            mentions: groupAdmins.map(v => v.id).concat([owner])
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`❌ An error occurred:\n\n${e}`);
    }
});
