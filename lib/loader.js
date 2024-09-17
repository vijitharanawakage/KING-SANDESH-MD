//base by MrUnknown
//re-upload? recode? copy code? give credit Okay Fuck :)
//YouTube: @Mr Unknown
//GitHub: @vijitharanawakage/KING-SANDESH-MD
//WhatsApp: +94741259325
//want more free bot scripts? Follow to my tiktok page: https://vm.tiktok.com/ZS2aQAvoF/

const fs = require('fs')
const { color } = require('./color')

async function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

async function nocache(module, cb = () => { }) {
    console.log(color('Module', 'blue'), color(`'${module} is up to date!'`, 'cyan'))
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

module.exports = {
    uncache,
    nocache
}
