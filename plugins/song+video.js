const {cmd , commands} = require('../command')
const fg = require('api-dylux')
const yts = require('yt-search')


cmd({
    pattern: "song",
    desc: "Download songs.",
    category: "download",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if(!q) return reply("❌ Error: Please give me URL or TITLE!")
const search = await yts(q)
const data = search.videos[0];
const url = data.url

let desc = `
*𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐒𝐎𝐍𝐆 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑 💤*

⛱️ Title: ${data.title}
⛱️ Description: ${data.description}
⛱️ Time: ${data.timestamp}
⛱️ Ago: ${data.ago}
⛱️ Views: ${data.views}

> 𝗞𝗜𝗡𝗚-𝗦𝗔𝗡𝗗𝗘𝗦𝗛-𝗠𝗨𝗟𝗧𝗜 𝗗𝗘𝗩𝗜𝗖𝗘💙
`
await conn.sendMessage(from,{image:{url: data.thumbnail},caption:desc},{quoted:mek});

//download audio

let down = await fg.yta(url)
let downloadUrl = down.dl_url

//send audio + document message
await conn.sendMessage(from,{audio: {url:downloadUrl},mimetype:"audio/mpeg"},{quoted:mek})
await conn.sendMessage(from,{document: {url:downloadUrl},mimetype:"audio/mpeg",fileName:data.title + ".mp3",caption:"𝗞𝗜𝗡𝗚-𝗦𝗔𝗡𝗗𝗘𝗦𝗛-𝗠𝗗"},{quoted:mek})




}catch(e){
console.log(e)
reply(`${e}`)
}
})

//============ video-dl ============


cmd({
    pattern: "video",
    desc: "Download videos.",
    category: "download",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if(!q) return reply("❌ Error: Please give me URL or TITLE!")
const search = await yts(q)
const data = search.videos[0];
const url = data.url

let desc = `
*𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑 💤*

⛱️ Title: ${data.title}
⛱️ Description: ${data.description}
⛱️ Time: ${data.timestamp}
⛱️ Ago: ${data.ago}
⛱️ Views: ${data.views}

> 𝗞𝗜𝗡𝗚-𝗦𝗔𝗡𝗗𝗘𝗦𝗛-𝗠𝗨𝗟𝗧𝗜 𝗗𝗘𝗩𝗜𝗖𝗘💙
`
await conn.sendMessage(from,{image:{url: data.thumbnail},caption:desc},{quoted:mek});

//download video

let down = await fg.ytv(url)
let downloadUrl = down.dl_url

//send video + document message
await conn.sendMessage(from,{video: {url:downloadUrl},mimetype:"video/mp4"},{quoted:mek})
await conn.sendMessage(from,{document: {url:downloadUrl},mimetype:"video/mp4",fileName:data.title + ".mp4",caption:"𝗞𝗜𝗡𝗚-𝗦𝗔𝗡𝗗𝗘𝗦𝗛-𝗠𝗗"},{quoted:mek})

}catch(e){
console.log(e)
reply(`${e}`)
}
})
