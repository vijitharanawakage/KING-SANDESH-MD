// code by ⿻ ⌜𝐌𝐑𝐔𝐍𝐊𝐍𝐎𝐖𝐍 𝐱 𝐆𝐑𝐀𝐘 𝐖𝐎𝐋𝐅

const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "gethtml",
  alias: ["htmlsource", "source"],
  react: "🌐",
  desc: "Get HTML source code of a given website URL.",
  category: "other",
  use: ".gethtml <url>",
  filename: __filename,
}, 
async (conn, mek, m, {
  from, reply, args, q
}) => {
  if (!q) {
    return reply("Please provide a URL.\nExample: .gethtml https://example.com");
  }

  try {
    // Validate URL (simple check)
    let url = q.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;  // add http if missing
    }

    const response = await axios.get(url);
    let html = response.data;

    // Limit length to avoid WhatsApp message length limit (~4096 chars)
    if (html.length > 3500) {
      html = html.slice(0, 3500) + "\n\n...[truncated]";
    }

    await reply(`🌐 𝐇𝐓𝐌𝐋 𝐒ᴏᴜʀᴄ𝐄 𝐎𝐅: ${url}\n\n${html}\n\n> *© Powered By King-Sandesh-Md V2 💸*`);
  } catch (e) {
    await reply("❌ Failed to fetch the URL or invalid URL provided.");
  }
});
