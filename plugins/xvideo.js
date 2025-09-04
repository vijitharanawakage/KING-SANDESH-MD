// XVIDEO DOWNLOAD COMMAND (LIST VERSION)

const { cmd } = require('../lib/command')
const { fetchJson } = require('../lib/functions')

const apilink = 'https://www.dark-yasiya-api.site/' // API LINK

cmd({
  pattern: "xv",
  alias: ["xxx", "sex"],
  react: "🔞",
  desc: "Search & download xvideo.com porn video",
  category: "download",
  use: ".xv <query>",
  filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return await reply("⚡ *Please provide a search query!*")

    const xv_list = await fetchJson(`${apilink}/search/xvideo?text=${encodeURIComponent(q)}`)
    if (!xv_list.result || xv_list.result.length === 0) {
      return await reply("❌ No results found for your query!")
    }

    // only first 10 results
    const results = xv_list.result.slice(0, 10)

    let textMsg = `🔞 *🔞 𝐊ꜱᴍᴅ 𝐗𝐗𝐗 𝐕ɪᴅᴇᴏ 𝐒ᴇᴀʀᴄ𝐇*\n\n*Search Query:* ${q}\n\n_Select a video below to download:_\n\n`

    const sections = [
      {
        title: "📥 𝙰𝚅𝙰𝙸𝙻𝙰𝙱𝙻𝙴 𝚅𝙸𝙳𝙴𝙾𝚂",
        rows: results.map((v, i) => ({
          title: v.title,
          rowId: `.xvdl ${v.url}`,
          description: `👁 ${v.views} | 👍 ${v.like}`
        }))
      }
    ]

    await conn.sendMessage(from, {
      text: textMsg,
      footer: "> *© Powered By King-Sandesh Md V2 💸*X",
      title: "🔞 𝐊ꜱᴍᴅ 𝐗𝐗𝐗 𝐕ɪᴅᴇᴏ 𝐃ᴏᴡɴʟᴏᴀᴅᴇʀ",
      buttonText: "📥 𝚂𝙴𝙻𝙴𝙲𝚃 𝚅𝙸𝙳𝙴𝙾",
      sections
    }, { quoted: mek })

  } catch (error) {
    console.log("XVIDEO SEARCH ERROR:", error)
    reply("❌ Error: " + (error.message || error))
  }
})


// VIDEO DOWNLOAD COMMAND
cmd({
  pattern: "xvdl",
  react: "⬇️",
  desc: "Download xvideo by link",
  category: "download",
  use: ".xvdl <url>",
  filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
  try {
    const url = args[0]
    if (!url) return reply("⚡ Please provide a valid video URL!")

    const xv_info = await fetchJson(`${apilink}/download/xvideo?url=${encodeURIComponent(url)}`)
    if (!xv_info.result || !xv_info.result.dl_link) {
      return await reply("❌ Could not fetch video. Try another one.")
    }

    const msg = `
🔞 *𝐊ꜱᴍ𝐃 𝐗𝐗𝐗 𝐕ɪᴅᴇ𝐎 𝐒ᴇᴀʀᴄ𝐇 𝐄ɴɢɪɴ𝐄* 🔞

🥵 *Title* - ${xv_info.result.title || "Unknown"}
👁️ *Views* - ${xv_info.result.views || "N/A"}
👍 *Likes* - ${xv_info.result.like || "N/A"}
`

    await conn.sendMessage(from, {
      text: msg,
      contextInfo: {
        externalAdReply: {
          title: "🔞 𝐊ꜱᴍᴅ 𝐗𝐗𝐗 𝐕ɪᴅᴇᴏ 𝐃ᴏᴡɴʟᴏᴀᴅᴇʀ",
          body: "𝚂𝙴𝙻𝙴𝙲𝚃 𝚅𝙸𝙳𝙴𝙾 𝙵𝚁𝙾𝙼 𝚂𝙴𝙰𝚁𝙲𝙷 𝚁𝙴𝚂𝚄𝙻𝚃𝚂",
          thumbnailUrl: xv_info.result.image,
          sourceUrl: url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: mek })

    await conn.sendMessage(from, {
      document: { url: xv_info.result.dl_link },
      mimetype: "video/mp4",
      fileName: `${xv_info.result.title || "xvideo"}.mp4`,
      caption: xv_info.result.title || "Downloaded Video"
    }, { quoted: mek })

  } catch (error) {
    console.log("XVIDEO DL ERROR:", error)
    reply("❌ Error: " + (error.message || error))
  }
})
