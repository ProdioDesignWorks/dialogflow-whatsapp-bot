const { uuid, } = require('../package-manager');
const { PROJECT_ID, } = require('../configs');
const { queryDialogflow } = require('./dialogflow.api');
const { sendWhatsAppMessage } = require('../api-service');

async function whatsAppInquiry(req, res){
	try{
		const { body: reqBody } = req;
		const { messages } = reqBody;

		if(messages.length){
			const message = messages[0];
			const { body, senderName, chatName } = message;

			// Remove all white spaces from number
			const senderNumber = chatName.replace(/ /g,'');
			const number = senderNumber.substring(3, senderNumber.length);

			const queryResponse = await whatsAppProcessQuery(senderName, number, body);
			const sendResponse = await whatsAppSendMessage(senderNumber, queryResponse);
			return res.status(200).send('Ok');
		} else {
			return res.status(400).send('No new messages received');
		}
	} catch (error) {
		return res.status(500).send(error);
	}
}

async function whatsAppProcessQuery(senderName, number, text){
	try{
		const sessionId = uuid();
		const response = await queryDialogflow(PROJECT_ID, sessionId, text);
		if(response === null){
			throw new Error(`DialogFlow didn't respond well.`)
		}else{
			const { queryText, fulfillmentText, intent, } = response;
			return fulfillmentText;
		}
	} catch (error) {
		throw error;
	}
}

async function whatsAppSendMessage(number, message){
	try{
		console.log(`number: ${number}`);
		console.log(`message: ${message}`);
		const { data } = await sendWhatsAppMessage(number, message);
		const { sent } = data;
		if (sent) {
			return 'Ok';
		} else {
			throw new Error('WhatsApp API service not responding!');
		}
	} catch (error) {
		throw error;
	}
}

exports.whatsAppInquiry = (req, res) => whatsAppInquiry(req, res)