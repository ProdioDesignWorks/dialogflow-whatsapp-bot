const { whatsAppRouter, tradeWizerRouter, } = require('./api.router');
const { whatsAppClient, tradeWizerClient, } = require('./api.config');

const sendWhatsAppMessage = (number, text) => (
	whatsAppClient({
		method: whatsAppRouter.SEND_MESSAGE.METHOD,
		url: whatsAppRouter.SEND_MESSAGE.URL,
		data: {
			phone: number,
			body: text
		},
	})
);

const fetchSubscriberBusiness = (mobile = '') => (
	tradeWizerClient({
		method: tradeWizerRouter.FETCH_BUSINESS_FROM_PHONE_NUMBER.METHOD,
		url: tradeWizerRouter.FETCH_BUSINESS_FROM_PHONE_NUMBER.URL,
		params: { mobile },
	})
);

exports.sendWhatsAppMessage = (number, text) => sendWhatsAppMessage(number, text);
exports.fetchSubscriberBusiness = (mobile = '') => fetchSubscriberBusiness(mobile);