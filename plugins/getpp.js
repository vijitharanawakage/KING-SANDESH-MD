import config from '../../config.cjs';

const profile = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "getpp") {
    let jid;

    if (text) {
      jid = `${text}@s.whatsapp.net`;
    } else if (m.quoted && m.quoted.sender) {
      jid = m.quoted.sender;
    } else {
      return m.reply(`😏 ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴡʜᴀᴛsᴀᴘᴘ ɴᴜᴍʙᴇʀ.\nExample: ${prefix}getpp 9474xxxxxxx`);
    }

    try {
      const ppUrl = await sock.profilePictureUrl(jid, 'image');
      if (ppUrl) {
        await sock.sendMessage(m.from, { image: { url: ppUrl }, caption: `Profile picture of ${jid.split('@')[0]}` }, { quoted: m });
      } else {
        await m.reply(`Could not fetch the profile picture for ${jid.split('@')[0]} or the user has no profile picture.`);
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      await m.reply(`An error occurred while trying to fetch the profile picture for ${jid.split('@')[0]}. Please ensure the number is valid.`);
    }
  }
};

export default profile;
