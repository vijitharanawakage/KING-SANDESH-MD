const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");

cmd({
  pattern: "imagine",
  alias: ["fluxai", "imagine"],
  react: "🚀",
  desc: "Generate an image using AI.",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) return reply("Please provide a prompt for the image.");

    await reply("> *ＧＥＮＥＲＡＴＩＮＧ ＩＭＡＧＥ...🔥*");

    const apiUrl = `https://api.siputzx.my.id/api/ai/flux?prompt=${encodeURIComponent(q)}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    if (!response || !response.data) {
      return reply("Error: The API did not return a valid image. Try again later.");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `💸 *𝐈ᴍᴀɢ𝐄 𝐆ᴇɴᴇʀᴀᴛᴇ𝐃 𝐁𝐘 𝐊ɪɴ𝐆 𝐒ᴀɴᴅᴇꜱ𝐇 𝐌𝐃* 🚀\n✨ 𝙿𝚁𝙾𝙼𝙿𝚃: *${q}*`
    });

  } catch (error) {
    console.error("FluxAI Error:", error);
    reply(`An error occurred: ${error.response?.data?.message || error.message || "Unknown error"}`);
  }
});

cmd({
  pattern: "stablediffusion",
  alias: ["sdiffusion", "imagine2"],
  react: "🚀",
  desc: "Generate an image using AI.",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) return reply("Please provide a prompt for the image.");

    await reply("> *ＧＥＮＥＲＡＴＩＮＧ ＩＭＡＧＥ...🔥*");

    const apiUrl = `https://api.siputzx.my.id/api/ai/stable-diffusion?prompt=${encodeURIComponent(q)}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    if (!response || !response.data) {
      return reply("Error: The API did not return a valid image. Try again later.");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `💸 *𝐈ᴍᴀɢ𝐄 𝐆ᴇɴᴇʀᴀᴛᴇ𝐃 𝐁𝐘 𝐊ɪɴ𝐆 𝐒ᴀɴᴅᴇꜱ𝐇 𝐌𝐃* 🚀\n✨ 𝙿𝚁𝙾𝙼𝙿𝚃: *${q}*`
    });

  } catch (error) {
    console.error("FluxAI Error:", error);
    reply(`An error occurred: ${error.response?.data?.message || error.message || "Unknown error"}`);
  }
});

cmd({
  pattern: "stabilityai",
  alias: ["stability", "imagine3"],
  react: "🚀",
  desc: "Generate an image using AI.",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) return reply("Please provide a prompt for the image.");

    await reply("> *ＧＥＮＥＲＡＴＩＮＧ ＩＭＡＧＥ...🔥*");

    const apiUrl = `https://api.siputzx.my.id/api/ai/stabilityai?prompt=${encodeURIComponent(q)}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    if (!response || !response.data) {
      return reply("Error: The API did not return a valid image. Try again later.");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `💸 *𝐈ᴍᴀɢ𝐄 𝐆ᴇɴᴇʀᴀᴛᴇ𝐃 𝐁𝐘 𝐊ɪɴ𝐆 𝐒ᴀɴᴅᴇꜱ𝐇 𝐌𝐃* 🚀\n✨ 𝙿𝚁𝙾𝙼𝙿𝚃: *${q}*`
    });

  } catch (error) {
    console.error("FluxAI Error:", error);
    reply(`An error occurred: ${error.response?.data?.message || error.message || "Unknown error"}`);
  }
});
