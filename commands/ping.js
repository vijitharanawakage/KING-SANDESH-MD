const os = require('os');

async function pingCommand(sock, chatId) {
    try {
        const start = Date.now();
        await new Promise(resolve => setTimeout(resolve, 100));
        const end = Date.now();
        const ping = Math.round(end - start);
        await sock.sendMessage(chatId, { text: `📍𝗣𝗶𝗻𝗴 𝗶𝘀\n${ping} 𝗠𝘀` });
    } catch (error) {
        console.error('Error in ping command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to get ping status.' });
    }
}

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0) time += `${seconds}s`;

    return time.trim();
}

module.exports = pingCommand;