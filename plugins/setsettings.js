const fs = require("fs");
const path = require("path");
const config = require("../config");
const { cmd } = require("../command");

const settingsPath = path.join(__dirname, "../setsettings.json");

function loadSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
    }
  } catch (e) {
    console.error("Error loading setsettings.json:", e);
  }
  return {};
}

function saveSettings(data) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Error saving setsettings.json:", e);
  }
}

function getAllKeys() {
  return Object.keys(config);
}

function getToggleableKeys(data) {
  return Object.entries(data)
    .filter(([_, value]) =>
      typeof value === "boolean" ||
      (typeof value === "string" && ["public", "private"].includes(value.toLowerCase()))
    )
    .map(([key]) => key);
}

function formatValue(value) {
  if (typeof value === "boolean") return value ? "✅ 𝙾𝙽" : "❌ 𝙾𝙵𝙵";
  if (typeof value === "string") {
    if (value.toLowerCase() === "public") return "👥 𝙿𝚄𝙱𝙻𝙸𝙲";
    if (value.toLowerCase() === "private") return "👤 𝙿𝚁𝙸𝚅𝙰𝚃𝙴";
  }
  return value.toString();
}

function toggleValue(key, val) {
  if (typeof val === "boolean") return !val;
  if (typeof val === "string") {
    if (val.toLowerCase() === "public") return "private";
    if (val.toLowerCase() === "private") return "public";
  }
  return val;
}

cmd({
  pattern: "setsettings ?(.*)",
  desc: "View and update bot settings",
  category: "system",
  react: "🛠️",
  filename: __filename,
  owner: true
}, async (conn, m, { from, args, isCreator, reply }) => {
  if (!isCreator) return reply("🚫 This Is Owner Only Command.");

  let settingsData = loadSettings();
  const allKeys = getAllKeys();

  // 🆕 Auto-import missing config keys (any type)
  allKeys.forEach((key) => {
    if (!(key in settingsData)) {
      settingsData[key] = config[key];
    }
  });
  saveSettings(settingsData);

  const toggleableKeys = getToggleableKeys(settingsData);

  // 📌 1. Show settings (Button / CLI)
  if (!args[0]) {
    if (config.BUTTON) {
      let text = "🛠️ *𝐁ᴏ𝐓 𝐒ᴇᴛᴛɪɴɢ𝐒 𝐈𝐍 𝐁ᴜᴛᴛᴏ𝐍*\n\n";
      toggleableKeys.forEach((key) => {
        text += `*${key}:* ${formatValue(settingsData[key])}\n`;
      });

      const buttons = toggleableKeys.map((key) => ({
        buttonId: `toggle_${key}`,
        buttonText: { displayText: `${key}: ${formatValue(settingsData[key])}` },
        type: 1,
      }));

      buttons.push({
        buttonId: "save_settings",
        buttonText: { displayText: "💾 𝚂𝙰𝚅𝙴 𝙲𝙷𝙰𝙽𝙶𝙴𝙴𝚂" },
        type: 1,
      });

      return conn.sendMessage(from, { text, buttons, headerType: 1 }, { quoted: m });
    } else {
      let text = "🛠️ *𝐁ᴏ𝐓 𝐒ᴇᴛᴛɪɴɢ𝐒 𝐈𝐍 𝐂𝐋𝐈*\n\n";
      toggleableKeys.forEach((key, i) => {
        let nowVal = settingsData[key];
        text += `*${i + 1}. ${key.toUpperCase()}*\n📎 ${formatValue(nowVal)}\n📍 ${i + 1}.1 true\n📍 ${i + 1}.2 false\n\n`;
      });
      return reply(text + "_Reply with correct number to toggle or `.setsettings edit KEY = VALUE`_");
    }
  }

  // 📌 2. Toggle CLI shortcut like `1.2`
  if (/^\d+\.(1|2)$/.test(args[0])) {
    const [indexStr, choice] = args[0].split(".");
    const index = parseInt(indexStr) - 1;
    if (index >= 0 && index < toggleableKeys.length) {
      const key = toggleableKeys[index];
      settingsData[key] = choice === "1";
      saveSettings(settingsData);
      return reply(`✅ *${key}* 𝐔ᴘᴅᴀᴛᴇᴅ 𝐓ᴏ *${formatValue(settingsData[key])}*`);
    }
    return reply("❌ Invalid index.");
  }

  // 📌 3. Button Handler
  if (m.message?.buttonsResponseMessage) {
    const btnId = m.message.buttonsResponseMessage.selectedButtonId;
    if (btnId.startsWith("toggle_")) {
      const key = btnId.replace("toggle_", "");
      if (!toggleableKeys.includes(key)) return reply(`❌ Invalid key: ${key}`);
      settingsData[key] = toggleValue(key, settingsData[key]);
      saveSettings(settingsData);

      let text = "🛠️ *𝐁ᴏ𝐓 𝐒ᴇᴛᴛɪɴɢ𝐒*\n\n";
      toggleableKeys.forEach((key) => {
        text += `*${key}:* ${formatValue(settingsData[key])}\n`;
      });

      const buttons = toggleableKeys.map((key) => ({
        buttonId: `toggle_${key}`,
        buttonText: { displayText: `${key}: ${formatValue(settingsData[key])}` },
        type: 1,
      }));

      buttons.push({
        buttonId: "save_settings",
        buttonText: { displayText: "💾 𝚂𝙰𝚅𝙴 𝙲𝙷𝙰𝙽𝙶𝙴𝚂" },
        type: 1,
      });

      return conn.sendMessage(from, { text, buttons, headerType: 1 }, { quoted: m });
    } else if (btnId === "save_settings") {
      saveSettings(settingsData);
      return reply("💾 𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂 𝚂𝙰𝚅𝙴𝙳.");
    }
  }

  // 📌 4. Manual toggle: `.setsettings toggle <KEY>`
  if (args[0].toLowerCase() === "toggle") {
    const key = args[1]?.toUpperCase();
    if (!toggleableKeys.includes(key)) return reply("❌ Invalid toggleable key.");
    settingsData[key] = toggleValue(key, settingsData[key]);
    saveSettings(settingsData);
    return reply(`✅ ${key} 𝐓ᴏɢɢʟᴇᴅ 𝐓ᴏ ${formatValue(settingsData[key])}`);
  }

  // 📌 5. Manual edit: `.setsettings edit <KEY> = <VALUE>`
  if (args[0].toLowerCase() === "edit") {
    const input = args.slice(1).join(" ");
    const [key, valRaw] = input.split("=").map((x) => x.trim());
    if (!key || valRaw === undefined) return reply("❌ Use format: `.setsettings edit KEY = VALUE`");

    let value;
    try {
      if (valRaw === "true") value = true;
      else if (valRaw === "false") value = false;
      else if (!isNaN(valRaw)) value = Number(valRaw);
      else if (valRaw.startsWith("{") || valRaw.startsWith("[")) value = JSON.parse(valRaw);
      else value = valRaw;
    } catch {
      return reply("❌ Invalid value. Use valid string/boolean/number/object.");
    }

    if (!allKeys.includes(key)) return reply("❌ Unknown config key.");

    settingsData[key] = value;
    saveSettings(settingsData);
    return reply(`✅ ${key} 𝐔ᴘᴅᴀᴛᴇᴅ 𝐓ᴏ: ${JSON.stringify(value)}`);
  }

  return reply("❌ Invalid usage. Use `.setsettings`, `toggle`, or `edit KEY = VALUE`");
});
