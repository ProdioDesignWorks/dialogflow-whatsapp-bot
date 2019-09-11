exports.whatsAppRouter = {
	SEND_MESSAGE: {
		URL: `/sendMessage`,
		METHOD: `POST`,
	},
	SEND_FILE: {
		URL: `/sendFile`,
		METHOD: `POST`,
	}
}

exports.tradeWizerRouter = {
	FETCH_BUSINESS_FROM_PHONE_NUMBER: {
		URL: `/subscribers/get-business`,
		METHOD: `GET`,
	}
}