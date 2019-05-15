const { router } = require('./api.router');
const { client } = require('./api.config');

const sendWhatsAppMessage = (number, text) => (
	client({
		method: router.SEND_MESSAGE.METHOD,
		url: router.SEND_MESSAGE.URL,
		data: {
			phone: number,
			body: text
		}
	})
);

exports.sendWhatsAppMessage = (number, text) => sendWhatsAppMessage(number, text);