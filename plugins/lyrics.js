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
import axios from 'axios';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import config from '../../config.cjs';

const Lyrics = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['lyrics', 'lyric'];

  if (validCommands.includes(cmd)) {
    if (!text)
      return m.reply(`Hellooow 😇 *_${m.pushName}_*~!\nWanna feel the magic of a song 🎧?\n\nTry like this:\n*.lyrics Lavender Haze Taylor Swift*\n\nI'll dive into the musical world 🎵 and fetch it for you~`);

    try {
      await m.React('⏳');
      await m.reply('✨ Just a sec sweet bean... flying to fetch your lyrics~ ✨');

      const parts = text.split(' ');
      let title = '';
      let artist = '';

      if (parts.length === 1) {
        title = parts[0];
      } else if (parts.length === 2) {
        title = parts[0];
        artist = parts[1];
      } else {
        const possibleArtist = parts.slice(-2).join(' ');
        const possibleTitle = parts.slice(0, -2).join(' ');

        title = possibleTitle || parts.slice(0, -1).join(' ');
        artist = possibleArtist;
      }

      const apiUrl = artist
        ? `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
        : `https://api.lyrics.ovh/v1//${encodeURIComponent(title)}`;

      const response = await axios.get(apiUrl);
      const result = response.data;

      if (result && result.lyrics) {
        const lyrics = result.lyrics.length > 4000
          ? result.lyrics.slice(0, 4000) + '\n\n(｡•́︿•̀｡) It was suuuper long so I trimmed it a lil~'
          : result.lyrics;

        const sparkleMsg = `*･ﾟ✧*:･ﾟ✧\n`;
        const footer = `\n\n— 🧚‍♀️ With love from your tiny lyrics fairy ~`;

        await m.reply(`${sparkleMsg}*~ Here’s your song, starshine ~*\n\n*🎶 Title:* _${title}_\n*🎤 Artist:* _${artist || '???'}_\n\n${lyrics}${footer}`);
        await m.React('💖');
      } else {
        throw new Error('Lyrics not found.');
      }
    } catch (error) {
      console.error('Lyrics error:', error.message);
      m.reply("🥺 Oh no~ I flapped my wings but couldn't find that song... maybe try again, okay cutie?");
      await m.React('🥺');
    }
  }
};

export default Lyrics;
