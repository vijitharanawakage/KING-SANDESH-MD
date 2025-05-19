const { addWelcome, delWelcome, isWelcomeOn, addGoodbye, delGoodBye, isGoodByeOn } = require('../lib/index');
const { delay } = require('@whiskeysockets/baileys');

async function handleWelcome(sock, chatId, message, match) {
	if (!match) {
		return sock.sendMessage(chatId, {
			text: `Welcome messages setup\n\n*.welcome on*\nTurn on welcome messages\n\n*.welcome "your message here"*\nSetup custom welcome messages\n\n*.welcome off*\nDisables welcome message in this group`
		});
	}

	if (match.toLowerCase() === 'on') {
		if (await isWelcomeOn(chatId)) {
			return sock.sendMessage(chatId, { text: '```Welcome Already Enabled```' });
		}
		await addWelcome(chatId, true, null);
		return sock.sendMessage(chatId, { text: '```Welcome enabled, use .welcome to customize it```' });
	}

	if (match === 'off') {
		if (!(await isWelcomeOn(chatId))) {
			return sock.sendMessage(chatId, { text: '```Welcome Already Disabled```' });
		}
		await delWelcome(chatId);
		return sock.sendMessage(chatId, { text: '```Welcome Disabled```' });
	}

	if (match !== 'off' && match !== 'on') {
		await addWelcome(chatId, true, match);
		return sock.sendMessage(chatId, { text: '```Custom Welcome Message Set```' });
	}

	return sock.sendMessage(chatId, { text: '```Use .welcome to see usage```' });
}

async function handleGoodbye(sock, chatId, message, match) {
	if (!match) {
		return sock.sendMessage(chatId, {
			text: `Goodbye messages setup\n\n*.goodbye on*\nTurn on goodbye messages\n\n*.goodbye "your message here"*\nSetup custom goodbye messages\n\n*.goodbye off*\nDisables goodbye message in this group`
		});
	}

	if (match === 'on') {
		if (await isGoodByeOn(chatId)) {
			return sock.sendMessage(chatId, { text: '_Goodbye Already on for this Group_' });
		}
		await addGoodbye(chatId, true, null);
		return sock.sendMessage(chatId, { text: '_Goodbye Messages Enabled, use .goodbye your message, to customize it_' });
	}

	if (match === 'off') {
		if (!(await isGoodByeOn(chatId))) {
			return sock.sendMessage(chatId, { text: '_Goodbye Already Disabled for this Group_' });
		}
		await delGoodBye(chatId);
		return sock.sendMessage(chatId, { text: '_Goodbye Messages Disabled for this Group_' });
	}

	if (match !== 'off' && match !== 'on') {
		await sock.sendMessage(chatId, {
			text: 'NOTE: _If your text is very long, setup your long goodbye message, and reply it to set as custom goodbye message_'
		});
		await delay(2000);
		await addGoodbye(chatId, true, match);
		return sock.sendMessage(chatId, { text: '_Custom GoodBye Message Set_' });
	}

	return sock.sendMessage(chatId, { text: '```Use .goodbye to see usage```' });
}

module.exports = { handleWelcome, handleGoodbye };