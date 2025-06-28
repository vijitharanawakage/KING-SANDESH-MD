import config from '../../config.cjs';

// Main command function
const anticallCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const [cmd, ...args] = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(/\s+/) : [''];
  const text = args.join(' ').trim().toLowerCase();

  const validCommands = ['autostatus', 'autosview', 'autostatusview'];

  if (validCommands.includes(cmd)) {
    if (!isCreator) return m.reply("*📛 THIS IS AN OWNER COMMAND*");
    let responseMessage = '';
    let updatedConfig = false;

    if (text === 'on') {
      config.AUTO_STATUS_SEEN = true;
      updatedConfig = true;
      responseMessage = "✅ AUTO STATUS SEEN has been enabled.";
    } else if (text === 'off') {
      config.AUTO_STATUS_SEEN = false;
      updatedConfig = true;
      responseMessage = "❌ AUTO STATUS SEEN has been disabled.";
    } else {
      responseMessage = `🌩️ Usage:\n- *${prefix + cmd} on:* Enable AUTO STATUS SEEN\n- *${prefix + cmd} off:* Disable AUTO STATUS SEEN`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
      if (updatedConfig) {
        // Optionally, you might want to save the updated config to a file here
        // depending on how your config is managed. For example:
        // import fs from 'node:fs/promises';
        // await fs.writeFile('../../config.cjs', `export default ${JSON.stringify(config, null, 2)};`);
        console.log("⚙️ Config updated:", config); // Log with emoji
      }
    } catch (error) {
      console.error("⚠️ Error processing your request:", error); // Error with warning emoji
      await Matrix.sendMessage(m.from, { text: '⚠️ Error processing your request.' }, { quoted: m });
    }
  }
};

export default anticallCommand;
