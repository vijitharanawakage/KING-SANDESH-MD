//base by MrUnknown
//re-upload? recode? copy code? give credit Okay Fuck :)
//YouTube: @Mr Unknown
//GitHub: @vijitharanawakage/KING-SANDESH-MD
//WhatsApp: +94741259325
//want more free bot scripts? Follow to my tiktok page: https://vm.tiktok.com/ZS2aQAvoF/

const fs = require('fs')
const chalk = require('chalk')

//session
global.sessionid ='ur session id'

//owmner v card
global.ytname = "TikTok: mr_unknown_sandesh" //ur tiktok page name
global.socialm = "GitHub: vijitharanawakage" //ur github or insta name
global.location = "Asia,Colombo" //ur location

//new
global.botname = '𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐕1' //ur bot name
global.ownernumber = '94741259325' //ur owner number
global.ownername = '🦄𝐌𝐑.𝐒𝐀𝐍𝐃𝐄𝐒𝐇 𝐁𝐇𝐀𝐒𝐇𝐀𝐍𝐀' //ur owner name
global.websitex = "https://mr-unknown-sandesh-support.netlify.app/"
global.wagc = "https://whatsapp.com/channel/0029VaG9VfPKWEKk1rxTQD20"
global.themeemoji = '🥰'
global.wm = "Mr Unknown Sandesh"
global.botscript = 'https://github.com/vijitharanawakage/KING-SANDESH-MD' //script link
global.packname = "Sticker By"
global.author = "🦄드림 가이 Mr Unknown\n\n+94741259325"
global.creator = "94741259325@s.whatsapp.net"
global.xprefix = '.'
global.premium = ["94741259325"] // Premium User
global.hituet = 0

//bot sett
global.typemenu = 'v8' // menu type 'v1' => 'v8'
global.typereply = 'v2' // reply type 'v1' => 'v3'
global.autoblocknumber = '92' //set autoblock country code
global.antiforeignnumber = '91' //set anti foreign number country code
global.welcome = true //welcome/left in groups
global.anticall = false //bot blocks user when called
global.autoswview = true //auto status/story view
global.adminevent = true //show promote/demote message
global.groupevent = true //show update messages in group chat
//msg
global.mess = {
	limit: 'Your limit is up!',
	nsfw: 'Nsfw is disabled in this group, Please tell the admin to enable',
    done: 'Done✓',
    error: 'Error!',
    success: 'Here you go!'
}
//thumbnail
global.thumb = fs.readFileSync('./XeonMedia/theme/cheemspic.jpg')

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update'${__filename}'`))
    delete require.cache[file]
    require(file)
})
