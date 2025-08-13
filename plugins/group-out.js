const { cmd } = require('../command');

cmd({
    pattern: "outgcc",
    alias: ["ck", "🦶"],
    desc: "Removes all members with specific country code from the group",
    category: "admin",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, reply, groupMetadata, isCreator
}) => {
    // Check if the command is used in a group
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    // Check if the user is the bot owner/creator
    if (!isCreator) {
        return reply("❌ Only the bot owner can use this command.");
    }

    // Check if the bot is an admin
    if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

    if (!q) return reply("❌ Please provide a country code. Example: .outgcc 92");

    const countryCode = q.trim();
    if (!/^\d+$/.test(countryCode)) {
        return reply("❌ Invalid country code. Please provide only numbers (e.g., 92 for +92 numbers)");
    }

    try {
        const participants = await groupMetadata.participants;
        const targets = participants.filter(
            participant => participant.id.startsWith(countryCode) && 
                         !participant.admin // Don't remove admins
        );

        if (targets.length === 0) {
            return reply(`❌ No members found with country code +${countryCode}`);
        }

        const jids = targets.map(p => p.id);
        await conn.groupParticipantsUpdate(from, jids, "remove");
        
        reply(`✅ 𝐒ᴜᴄᴄᴇꜱꜱꜰᴜʟʟ𝐘 𝐑ᴇᴍᴏᴠᴇ𝐃 ${targets.length} 𝐌ᴇᴍʙᴇʀ𝐒 𝐖ɪᴛ𝐇 𝐂ᴏᴜɴᴛʀ𝐘 𝐂ᴏᴅ𝐄 +${countryCode}`);
    } catch (error) {
        console.error("Out command error:", error);
        reply("❌ Failed to remove members. Error: " + error.message);
    }
});
