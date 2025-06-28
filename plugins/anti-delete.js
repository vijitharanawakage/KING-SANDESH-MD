/*                                   
───────────────────────────────────────────────────────────────────

    ------------උකනව දාල කැරිම තේ එක 👺කමාන්ඩ් කොපි කරොත් කඩන් කනවා තොපේ...කනව කැවුත්ත මුන්ගෙ මමනම්...ක්‍රෙඩිට් එක තියලා වැඩක් කරනවනම් කරපන්------------
    
───────────────────────────────────────────────────────────────────    
Made by Mr Sandesh Bhashana
contact owner +94741259325

CURRENTLY RUNNING ON BETA VERSION!!
*
   * @project_name : KING-SANDESH-MD-V1
   * @author : <| 𝐌𝐑 𝐔𝐍𝐊𝐍𝐎𝐖𝐍 🫧
   * @youtube : https://www.youtube.com/@Black-Tappy
   * @description : Ksmd v2 ,A Multi-functional third party whatsapp user bot.
   * @version 2
*
   * Licensed under the  GPL-3.0 License;
* 
   * ┌┤Created By Mr Unknown tech info.
   * © 2025 King-sandesh-md | sandesh bhashana | mr unknown ✭.
   * plugin date : 27/6/2025.
* 
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
*/



import fs from 'fs';
import config from '../../config.cjs';
import pkg from '@whiskeysockets/baileys';
const { proto, downloadContentFromMessage } = pkg;

const prefix = config.PREFIX;
const antiDeleteGlobal = config.ANTI_DELETE;

const demonContext = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363402220977044@newsletter',
    newsletterName: "<| 𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐕❷🫧",
    serverMessageId: 143
  }
};

class DemonAntiDelete {
  constructor() {
    this.enabled = false;
    this.messageCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanExpiredMessages(), this.cacheExpiry);
  }

  cleanExpiredMessages() {
    const now = Date.now();
    for (const [key, msg] of this.messageCache.entries()) {
      if (now - msg.timestamp > this.cacheExpiry) {
        this.messageCache.delete(key);
      }
    }
  }

  formatTime(timestamp) {
    const options = {
      timeZone: 'Asia/Colombo',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    return new Date(timestamp).toLocaleString('en-PK', options) + ' (PKT)';
  }
}

const demonDelete = new DemonAntiDelete();
const statusPath = './demon_antidelete.json';

let statusData = {};
if (fs.existsSync(statusPath)) {
  statusData = JSON.parse(fs.readFileSync(statusPath));
}
if (!statusData.chats) statusData.chats = {};

if (antiDeleteGlobal) {
  demonDelete.enabled = true;
}

const AntiDelete = async (m, Matrix) => {
  const chatId = m.from;
  const formatJid = (jid) => jid ? jid.replace(/@s\.whatsapp\.net|@g\.us/g, '') : 'Unknown';

  const getChatInfo = async (jid) => {
    if (!jid) return { name: 'Unknown Chat', isGroup: false };
    if (jid.includes('@g.us')) {
      try {
        const groupMetadata = await Matrix.groupMetadata(jid);
        return {
          name: groupMetadata?.subject || 'Demon Nest',
          isGroup: true
        };
      } catch {
        return { name: 'Demon Nest', isGroup: true };
      }
    }
    return { name: 'Private Mission', isGroup: false };
  };

  if (m.body.toLowerCase() === `${prefix}antidelete on` || m.body.toLowerCase() === `${prefix}antidelete off`) {
    const responses = {
      on: {
        text: `*✅ King-Sandesh-Md Anti-Delete Activated..!*\n\n` +
              `• Status: ✅ Enabled\n` +
              `• Cache: 🕒 5 minutes\n` +
              `• Mode: 🌐 Global\n\n` +
              `_Deleted messages will now rise from the shadows_\n\n` +
              `━━━━━━⊱✿⊰━━━━━━\n` +
              `> *© Powered By King-Sandesh Md V2 💸*`,
        contextInfo: demonContext
      },
      off: {
        text: `⛔ *King-Sandesh-Md Anti-Delete Deactivated..!*\n\n` +
              `• Status: ❌ Disabled\n\n` +
              `_Message recovery disabled_\n\n` +
              `━━━━━━⊱✿⊰━━━━━━\n` +
              `> *© Powered By King-Sandesh Md V2 💸*`,
        contextInfo: demonContext
      }
    };

    if (m.body.toLowerCase() === `${prefix}antidelete on`) {
      statusData.chats[chatId] = true;
      fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));
      demonDelete.enabled = true;
      await Matrix.sendMessage(m.from, responses.on, { quoted: m });
    } else {
      statusData.chats[chatId] = false;
      fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));
      demonDelete.enabled = false;
      demonDelete.messageCache.clear();
      await Matrix.sendMessage(m.from, responses.off, { quoted: m });
    }

    await Matrix.sendReaction(m.from, m.key, '⚔️');
    return;
  }

  Matrix.ev.on('messages.upsert', async ({ messages }) => {
    if (!antiDeleteGlobal && !demonDelete.enabled) return;
    if (!messages?.length) return;

    for (const msg of messages) {
      if (msg.key.fromMe || !msg.message || msg.key.remoteJid === 'status@broadcast') continue;

      try {
        const content = msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          msg.message.imageMessage?.caption ||
          msg.message.videoMessage?.caption ||
          msg.message.documentMessage?.caption;

        let media, type, mimetype;
        const mediaTypes = ['image', 'video', 'audio', 'sticker', 'document'];

        for (const mediaType of mediaTypes) {
          if (msg.message[`${mediaType}Message`]) {
            const mediaMsg = msg.message[`${mediaType}Message`];
            try {
              const stream = await downloadContentFromMessage(mediaMsg, mediaType);
              let buffer = Buffer.from([]);
              for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
              media = buffer;
              type = mediaType;
              mimetype = mediaMsg.mimetype;
              break;
            } catch {}
          }
        }

        if (msg.message.audioMessage?.ptt) {
          try {
            const stream = await downloadContentFromMessage(msg.message.audioMessage, 'audio');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
            media = buffer;
            type = 'voice';
            mimetype = msg.message.audioMessage.mimetype;
          } catch {}
        }

        if (content || media) {
          demonDelete.messageCache.set(msg.key.id, {
            content,
            media,
            type,
            mimetype,
            sender: msg.key.participant || msg.key.remoteJid,
            senderFormatted: `@${formatJid(msg.key.participant || msg.key.remoteJid)}`,
            timestamp: Date.now(),
            chatJid: msg.key.remoteJid
          });
        }
      } catch {}
    }
  });

  Matrix.ev.on('messages.update', async (updates) => {
    if (!antiDeleteGlobal && !demonDelete.enabled) return;
    if (!updates?.length) return;

    for (const update of updates) {
      try {
        const { key, update: updateData } = update;
        const isDeleted = updateData?.messageStubType === proto.WebMessageInfo.StubType.REVOKE ||
          updateData?.status === proto.WebMessageInfo.Status.DELETED;

        if (!isDeleted || key.fromMe || !demonDelete.messageCache.has(key.id)) continue;

        const cachedMsg = demonDelete.messageCache.get(key.id);
        demonDelete.messageCache.delete(key.id);

        const chatInfo = await getChatInfo(cachedMsg.chatJid);
        const deletedBy = updateData?.participant ?
          `@${formatJid(updateData.participant)}` :
          (key.participant ? `@${formatJid(key.participant)}` : 'Unknown Demon');

        const messageType = cachedMsg.type ?
          cachedMsg.type.charAt(0).toUpperCase() + cachedMsg.type.slice(1) :
          'Message';

        const baseInfo = `⚔️ *Recovered Deleted ${messageType}*\n\n` +
          `👤 *Sender:* ${cachedMsg.senderFormatted}\n` +
          `🗡️ *Deleted By:* ${deletedBy}\n` +
          `🏰 *Location:* ${chatInfo.name}${chatInfo.isGroup ? ' (Group)' : ''}\n` +
          `⏰ *Sent At:* ${demonDelete.formatTime(cachedMsg.timestamp)}\n` +
          `🕰️ *Deleted At:* ${demonDelete.formatTime(Date.now())}\n\n` +
          `━━━━━━━━━━━━━━━\n` +
          `> *© Powered By King-Sandesh Md V2 💸*`;

        if (cachedMsg.media) {
          await Matrix.sendMessage(cachedMsg.chatJid, {
            [cachedMsg.type]: cachedMsg.media,
            mimetype: cachedMsg.mimetype,
            caption: baseInfo,
            contextInfo: demonContext
          });
        } else if (cachedMsg.content) {
          await Matrix.sendMessage(cachedMsg.chatJid, {
            text: `${baseInfo}\n\n📜 *Recovered Content:* \n${cachedMsg.content}`,
            contextInfo: demonContext
          });
        }
      } catch {}
    }
  });
};

export default AntiDelete;
