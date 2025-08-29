const { cmd } = require('../command');
const axios = require('axios');
const cheerio = require('cheerio');

let searchResults = {}; // Store user search sessions

cmd({
  pattern: "xhamster",
  react: "🔞",
  desc: "Search and download videos from XHamster",
  category: "download",
  use: ".xhamster <query>",
  filename: __filename
}, async (conn, mek, m, { args, reply, from, sender }) => {
  try {
    const query = args.join(" ");
    if (!query) return reply("❌ Please enter a search term!\nExample: .xhamster anal");

    const url = `https://xhamster.com/search/${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let results = [];
    $(".video-thumb").each((i, el) => {
      const title = $(el).find("a.video-thumb__title").text().trim();
      const link = $(el).find("a.video-thumb__title").attr("href");
      const img = $(el).find("img").attr("src") || $(el).find("img").attr("data-src");
      if (title && link) {
        results.push({
          title,
          link: "https://xhamster.com" + link,
          img
        });
      }
    });

    if (results.length === 0) return reply("⚠️ No results found!");

    // Save session for user
    searchResults[from] = results;

    // Send each result separately with numbering
    for (let i = 0; i < results.length && i < 10; i++) {
      const res = results[i];
      await conn.sendMessage(from, {
        image: { url: res.img },
        caption: `*${i + 1}.* ${res.title}\n🔗 ${res.link}\n\n👉 Reply with *${i + 1}* to download`
      }, { quoted: mek });
    }

  } catch (e) {
    console.error(e);
    reply("❌ Error while searching XHamster!");
  }
});

// Handle reply numbers
cmd({
  on: "text"
}, async (conn, mek, m, { reply, from, body }) => {
  try {
    if (!searchResults[from]) return;

    const num = parseInt(body.trim());
    if (isNaN(num) || num < 1 || num > searchResults[from].length) return;

    const selected = searchResults[from][num - 1];
    reply(`⏳ Fetching video: ${selected.title}`);

    // Fetch video page
    const { data } = await axios.get(selected.link);
    const $ = cheerio.load(data);

    // Find video URL (XHamster stores in JSON config)
    const script = $('script:contains("window.initials")').html();
    const match = script ? script.match(/"mp4":"(.*?)"/) : null;
    const videoUrl = match ? match[1].replace(/\\/g, "") : null;

    if (!videoUrl) return reply("❌ Could not fetch direct video link!");

    // Send as document
    const fileName = selected.title.replace(/[^\w\s]/gi, "_") + ".mp4";
    await conn.sendMessage(from, {
      document: { url: videoUrl },
      mimetype: "video/mp4",
      fileName: fileName,
      caption: selected.title
    }, { quoted: mek });

    // Clear session
    delete searchResults[from];

  } catch (e) {
    console.error(e);
    reply("❌ Error while downloading video!");
  }
});
