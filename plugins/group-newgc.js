//---------------------------------------------------------------------------
//           KS-MD  
//---------------------------------------------------------------------------
//  ⚠️ DO NOT MODIFY THIS FILE ⚠️  
//---------------------------------------------------------------------------
const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

cmd({
  pattern: "newgc",
  category: "group",
  desc: "Create a new group and add participants.",
  filename: __filename,
}, async (conn, mek, m, { from, isGroup, body, sender, groupMetadata, participants, reply }) => {
  try {
    if (!body) {
      return reply(`Usage: .newgc group_name;number1,number2,...`);
    }

    const [groupName, numbersString] = body.split(";");
    
    if (!groupName || !numbersString) {
      return reply(`Usage: .newgc group_name;number1,number2,...`);
    }

    const participantNumbers = numbersString.split(",").map(number => `${number.trim()}@s.whatsapp.net`);

    const group = await conn.groupCreate(groupName, participantNumbers);
    console.log('created group with id: ' + group.id); // Use group.id here

    const inviteLink = await conn.groupInviteCode(group.id); // Use group.id to get the invite link

    await conn.sendMessage(group.id, { text: '👾 ＨＥＬＬＯＷ ＴＨＥＩＲ,' });

    reply(`𝙶𝚁𝙾𝚄𝙿 𝙲𝚁𝙴𝙰𝚃𝙴𝙳 𝚂𝚄𝙲𝙲𝙴𝚂𝚂𝙵𝚄𝙻𝙻𝚈 𝚆𝙸𝚃𝙷 𝙸𝙽𝚅𝙸𝚃𝙴 𝙻𝙸𝙽𝙺 : https://chat.whatsapp.com/${inviteLink}\n✅ ＷᴇʟᴄᴏᴍＥ ＭᴇꜱꜱᴀɢＥ ＳᴇɴＴ.`);
  } catch (e) {
    return reply(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
  }
});


