//base by MrUnknown
//re-upload? recode? copy code? give credit Okay Fuck :)
//YouTube: @Mr Unknown
//GitHub: @vijitharanawakage/KING-SANDESH-MD
//WhatsApp: +94741259325
//want more free bot scripts? Follow to my tiktok page: https://vm.tiktok.com/ZS2aQAvoF/

const chalk = require('chalk')
const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}
const bgcolor = (text, bgcolor) => {
	return !bgcolor ? chalk.green(text) : chalk.bgKeyword(bgcolor)(text)
}
module.exports = {
	color,
	bgcolor
}
