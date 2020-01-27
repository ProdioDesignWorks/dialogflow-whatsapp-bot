const { path, fs } = require('../package-manager');
const { whatsAppRouter, tradeWizerRouter, } = require('./api.router');
const { whatsAppClient, tradeWizerClient, httpClient } = require('./api.config');
const { readFile, deleteFile } = require('../utilities');

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

const sendWhatsAppFileMessage = async (number, fileName, file) => {
	const fp = path.resolve(__dirname, `../files/${fileName}`);
  	const fileWriter = fs.createWriteStream(fp)
	const fileReader = await httpClient({
		url: file,
	    method: 'GET',
	    responseType: 'stream'
	});

	fileReader.data.pipe(writer)
	fileWriter.on('finish', () => {
		const encodedFile = readFile(fp, 'base64');
		deleteFile(fp);
		
		return whatsAppClient({
			method: whatsAppRouter.SEND_FILE.METHOD,
			url: whatsAppRouter.SEND_FILE.URL,
			data: {
				phone: number,
				body: encodedFile,
				filename: fileName
			}
		})
	});
    fileWriter.on('error', (error) => {
    	throw error;
    });
};

const fetchSubscriberBusiness = (mobile = '') => (
	tradeWizerClient({
		method: tradeWizerRouter.FETCH_BUSINESS_FROM_PHONE_NUMBER.METHOD,
		url: tradeWizerRouter.FETCH_BUSINESS_FROM_PHONE_NUMBER.URL,
		params: { mobile },
	})
);

exports.sendWhatsAppMessage = (number, text) => sendWhatsAppMessage(number, text);
exports.sendWhatsAppFileMessage = (number, fileName, file) => sendWhatsAppFileMessage(number, fileName, file);
exports.fetchSubscriberBusiness = (mobile = '') => fetchSubscriberBusiness(mobile);