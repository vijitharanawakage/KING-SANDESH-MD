const { cmd } = require('../command');
const axios = require("axios");
const cheerio = require("cheerio");
const config = require("../config");

let searchCache = {}; // store search results temporarily

cmd({
  pattern: "xhamster",
  react: "🔞",
  desc: "Search and download videos from XHamster",
  category: "download",
  filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
  try {
    if (!q) return reply("🔎 Please provide a search term. Example: *.xhamster milf*");

    const searchUrl = `https://xhamster.com/search/${encodeURIComponent(q)}`;
    const { data } = await axios.get(searchUrl);
    const $ = cheerio.load(data);

    let results = [];
    $(".video-thumb").each((i, el) => {
      const title = $(el).find("a").attr("title");
      const url = $(el).find("a").attr("href");
      const duration = $(el).find(".duration").text().trim();
      const thumb = $(el).find("img").attr("data-src") || $(el).find("img").attr("src");
      if (title && url) {
        results.push({ title, url: "https://xhamster.com" + url, duration, thumb });
      }
    });

    if (!results.length) return reply("❌ No results found.");

    searchCache[from] = results;

    let msg = "🔞 *XHamster Search Results:*\n\n";
    results.slice(0, 10).forEach((v, i) => {
      msg += `*${i + 1}.* ${v.title}\n⏱ ${v.duration}\n\n`;
    });
    msg += "_Reply with the number to download the video._";

    await conn.sendMessage(from, { image: { url: results[0].thumb }, caption: msg }, { quoted: mek });
  } catch (e) {
    console.error(e);
    reply("❌ Error fetching search results.");
  }
});

// handle reply with number
cmd({
  on: "text"
}, async (conn, mek, m, { from, reply, body, isGroup }) => {
  try {
    if (!searchCache[from]) return;
    if (!/^\d+$/.test(body.trim())) return;

    let index = parseInt(body.trim()) - 1;
    let results = searchCache[from];
    if (!results[index]) return reply("❌ Invalid number.");

    let video = results[index];
    reply(`⬇️ Downloading: *${video.title}*`);

    // scrape direct mp4 link
    const { data } = await axios.get(video.url);
    const $ = cheerio.load(data);

    let videoUrl = $("video").attr("src") || $("source").attr("src");
    if (!videoUrl) return reply("❌ Failed to fetch video URL.");

    const fileName = video.title.replace(/[^a-zA-Z0-9]/g, "_") + ".mp4";
    const caption = `✅ Downloaded from *XHamster*\n🎬 Title: ${video.title}`;

    const sendObj = {
      document: { url: videoUrl },
      mimetype: "video/mp4",
      fileName: fileName,
      caption: caption
    };

    await conn.sendMessage(from, sendObj, { quoted: mek });
    delete searchCache[from];
  } catch (e) {
    console.error(e);
    reply("❌ Error while downloading video.");
  }
});
