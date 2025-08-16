// plugins/auto-voice.js
const fs = require('fs');
const path = require('path');
const { cmd } = require('../command'); // your command helper
const config = require('../config');

// path to JSON and assets folder (adjust if your project structure different)
const JSON_PATHS = [
  path.join(__dirname, '..', 'assets', 'autovoice.json'),
  path.join(__dirname, '..', 'autovoice.json'),
];
const AUDIO_ASSETS_DIR = path.join(__dirname, '..', 'assets', 'autovoice'); // put files here

// load mapping (safe)
function loadMapping() {
  for (const p of JSON_PATHS) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf8');
        const json = JSON.parse(raw);
        return json;
      } catch (e) {
        console.error('[autovoice] Failed to parse json:', p, e);
        return {};
      }
    }
  }
  return {};
}

// helper: normalize incoming text for matching
function normalizeText(txt) {
  if (!txt) return '';
  return txt
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width
    .replace(/[^\p{L}\p{N}\s\.\-_]/gu, '') // keep letters, numbers, space, dot, -, _
    .replace(/\s+/g, ' ');
}

// helper: get mimetype from filename
function getMimeFromName(name) {
  const ext = (name || '').split('.').pop().toLowerCase();
  if (ext === 'mp3') return 'audio/mpeg';
  if (ext === 'm4a' || ext === 'aac') return 'audio/mp4';
  if (ext === 'ogg' || ext === 'opus') return 'audio/ogg';
  if (ext === 'wav') return 'audio/wav';
  return 'audio/mpeg';
}

// Try to resolve a value to a url or local file path
function resolveAudioSource(value) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value; // remote URL
  // if value looks like local filename, check assets dir
  const localPath = path.join(AUDIO_ASSETS_DIR, value);
  if (fs.existsSync(localPath)) return localPath;
  // also check directly under assets root
  const altPath = path.join(__dirname, '..', 'assets', value);
  if (fs.existsSync(altPath)) return altPath;
  // if user provided absolute path
  if (fs.existsSync(value)) return value;
  return null;
}

// LOAD mapping at start
let mapping = loadMapping();

// Optionally watch file for changes (hot reload)
for (const p of JSON_PATHS) {
  if (fs.existsSync(p)) {
    fs.watchFile(p, { interval: 2000 }, () => {
      console.log('[autovoice] mapping file changed, reloading...');
      mapping = loadMapping();
    });
    break;
  }
}

// Register a "body" plugin so it runs on every text message body
cmd({
  pattern: 'autovoice', // name only — this plugin uses `on: "body"`
  desc: 'Auto voice replies (internal)',
  category: 'auto',
  filename: __filename,
  on: 'body'
}, async (conn, mek, m, { from, quoted, body, isCmd, isGroup }) => {
  try {
    // get message text
    const text = (body || m?.message?.conversation || m?.message?.extendedTextMessage?.text || '').toString();
    if (!text) return;

    // exact match first (keep original casing keys too)
    if (mapping[text]) {
      const src = resolveAudioSource(mapping[text]);
      if (!src) return; // file not found
      const mimetype = getMimeFromName(mapping[text]);
      await conn.sendMessage(from, { audio: { url: src }, mimetype, ptt: true }, { quoted: m });
      return;
    }

    // normalized match
    const norm = normalizeText(text);
    if (!norm) return;

    // try keys normalized
    const keys = Object.keys(mapping);
    for (let k of keys) {
      const nk = normalizeText(k);
      if (!nk) continue;
      if (nk === norm) {
        const val = mapping[k];
        const src = resolveAudioSource(val);
        if (!src) return;
        const mimetype = getMimeFromName(val);
        await conn.sendMessage(from, { audio: { url: src }, mimetype, ptt: true }, { quoted: m });
        return;
      }
    }

    // no match -> nothing
  } catch (err) {
    console.error('[autovoice] Error handling message:', err);
  }
});
