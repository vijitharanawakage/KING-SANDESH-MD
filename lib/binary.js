//base by MrUnknown
//re-upload? recode? copy code? give credit Okay Fuck :)
//YouTube: @Mr Unknown
//GitHub: @vijitharanawakage/KING-SANDESH-MD
//WhatsApp: +94741259325
//want more free bot scripts? Follow to my tiktok page: https://vm.tiktok.com/ZS2aQAvoF/

async function dBinary(str) {
var newBin = str.split(" ")
var binCode = []
for (i = 0; i < newBin.length; i++) {
    binCode.push(String.fromCharCode(parseInt(newBin[i], 2)))
  }
return binCode.join("")
}

async function eBinary(str = ''){    
let res = ''
res = str.split('').map(char => {       
return char.charCodeAt(0).toString(2);  
 }).join(' ')
return res
}

module.exports = { dBinary, eBinary }