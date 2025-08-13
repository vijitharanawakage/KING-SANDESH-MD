
const { cmd } = require("../command");
const config = require("../config");

cmd({
    pattern: "report",
    alias: ["ask", "bug", "request"],
    desc: "Report a bug or request a feature",
    category: "utility",
    filename: __filename
}, async (conn, mek, m, {
    from, body, command, args, senderNumber, reply
}) => {
    try {
        const botOwner = conn.user.id.split(":")[0]; // Extract the bot owner's number
        if (senderNumber !== botOwner) {
            return reply("Only the bot owner can use this command.");
        }
        
        if (!args.length) {
            return reply(`Example: ${config.PREFIX}report Play command is not working`);
        }

        const reportedMessages = {};
        const devNumber = "94741259325"; // Bot owner's number
        const messageId = m.key.id;

        if (reportedMessages[messageId]) {
            return reply("This report has already been forwarded to the owner. Please wait for a response.");
        }
        reportedMessages[messageId] = true;

        const reportText = `*| REQUEST/BUG |*\n\n*𝚄𝚂𝙴𝚁*: @${m.sender.split("@")[0]}\n*𝚁𝙴𝚀𝚄𝙴𝚂𝚃/𝙱𝚄𝙶*: ${args.join(" ")}`;
        const confirmationText = `𝙷𝙸 ${m.pushName}, 𝚈𝙾𝚄𝚁 𝚁𝙴𝚀𝚄𝙴𝚂𝚃 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝙵𝙾𝙴𝚆𝙰𝚁𝙳𝙴𝙳 𝚃𝙾 𝚃𝙷𝙴 𝙾𝚆𝙽𝙴𝚁. 𝙿𝙻𝙴𝙰𝚂𝙴 𝚆𝙰𝙸𝚃...`;

        await conn.sendMessage(`${devNumber}@s.whatsapp.net`, {
            text: reportText,
            mentions: [m.sender]
        }, { quoted: m });

        reply(confirmationText);
    } catch (error) {
        console.error(error);
        reply("An error occurred while processing your report.");
    }
});
