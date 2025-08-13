const { sleep } = require('../lib/functions');
const config = require('../config')
const { cmd, commands } = require('../command')


// Mrunknown x graywolf

cmd({
    pattern: "leave",
    alias: ["left", "leftgc", "kickme"],
    desc: "Leave the group",
    react: "🎉",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply
}) => {
    try {

        if (!isGroup) {
            return reply("This command can only be used in groups.");
        }
        

        const botOwner = conn.user.id.split(":")[0]; 
        if (senderNumber !== botOwner) {
            return reply("Only the bot owner can use this command.");
        }

        reply("𝙸 𝙰𝙼 𝙻𝙴𝙰𝚅𝙸𝙽𝙶 𝙵𝚁𝙾𝙼 𝙶𝚁𝙾𝚄𝙿...👾");
        await sleep(1500);
        await conn.groupLeave(from);
        reply("𝐆ᴏᴏᴅ 𝐁ʏᴇ 𝐆ᴜʏꜱ..! 👋");
    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e}`);
    }
});

