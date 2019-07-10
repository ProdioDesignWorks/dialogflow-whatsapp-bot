const { uuid, } = require('../package-manager');
const { queryDialogflow } = require('./dialogflow.api');
const { sendWhatsAppMessage, fetchSubscriberBusiness } = require('../apis');
const playydateUsers = require('../configs/play-date-users.json');
const { getErrorStatus, isIndianPhoneNumber, } = require('../utilities');

/**
 * Accepts request from whatsapp server and process the inquiry.
 * This API processes the whatsapp inquiry of a subscriber
 * @param {object} req express request object
 * @param {object} res express response object
 */
async function whatsAppInquiry(req, res){
	try{
		const { body: reqBody } = req;
		const { messages } = reqBody;

		if(messages.length){
			const message = messages[0];
			const { body, senderName, chatName, fromMe } = message;

			if (fromMe) {
				//This message was triggered by whatsapp bot because
				//If I'll send msg to someone, then also it's treated as an event and sent on this webhook
				//which results in an infinite loop or recursion
				return res.status(200).send('Self triggered message, ignored!');
			}

			// Remove all white spaces from number
			const senderNumber = chatName.replace(/ /g,'');
			const number = senderNumber.substring(3, senderNumber.length);

			const queryResponse = await whatsAppProcessQuery(senderName, number, body);
			const sendResponse = await sendMessageOnWhatsApp(senderNumber, queryResponse);

			return res.status(200).send('Ok');
		} else {
			return res.status(400).send('No new messages received');
		}
	} catch (error) {
		const message = error.message || 'Something went wrong!';
		return res.status(500).send(message);
	}
}

/**
 * Sends a text message to Whatsapp number
 * @param {object} req express request object
 * @param {object} res express response object
 */
async function whatsAppSendMessage(req, res){
	try{
		const { body } = req;
		const { number = '', message = '' } = body;

		if (!message.length) {
			return res.status(400).send('Empty message');
		}

		if (!isIndianPhoneNumber(number)) {
			return res.status(400).send('Invalid contact number');
		}

		if (number.includes('+91')) {
			await sendMessageOnWhatsApp(number, message);
			return res.status(200).send('Ok');	
		} else {
			await sendMessageOnWhatsApp(`+91${number}`, message);
			return res.status(200).send('Ok');
		}
	} catch (error) {
		const message = error.message || 'Something went wrong!';
		return res.status(500).send(message);
	}
}

/**
 * Fetches the business of Whatsapp subscriber
 * @param {string} number     Whatapp number of the subscriber
 */
async function fetchBusiness(number){
	try{
		if(playydateUsers.includes(number)){
			return { businessId: 'PLAYY_DATE' }; 
		}

		const businesses = await fetchSubscriberBusiness(number);

		if(!businesses.length){
			/**
			*	This subscriber is not registered with any business, So redirect the inquiry to tradewizer bot.
			*	This done with an intention to keep existing config intact, 
			*        where all numbers are considered as TW subscribers
			**/
			return { businessId: 'TRADE_WIZER' }; 
		}else if(businesses.length > 1){
			//This subscriber is registered with multiple business
			throw new Error('Multiple businesses found!');
		}else if(businesses.length === 1){
			//This subscriber is registered with a business
			const { business_id: businessId } = businesses[0];
			return { businessId }; 
		}
	} catch (error) {
		/**
		*	This subscriber is not registered with any business, So redirect the inquiry to tradewizer bot.
		*	This done with an intention to keep existing config intact, 
		*        where all numbers are considered as TW subscribers
		**/
		if (getErrorStatus(error) === 404) {
			return { businessId: 'TRADE_WIZER' }; 
		}
		
		throw error;
	}
}

/**
 * Processes the whatsapp inquiry from the subscriber by routing it to dialogflow bot
 * @param {string} senderName Name of the Whatsapp subscriber
 * @param {string} number     Whatapp number of the subscriber
 * @param {string} text       text message received from Whatsapp number i.e. from Whatsapp subscriber
 */
async function whatsAppProcessQuery(senderName, number, text){
	try{
		const business = await fetchBusiness(number);
		const { businessId } = business;
		// const sessionId = uuid();
		// Using whatsapp number as session id ensures we keep the context intact, across the conversation
		const sessionId = number;

		const response = await queryDialogflow(businessId, sessionId, text);

		if(response === null){
			throw new Error(`DialogFlow didn't respond well.`)
		}else{
			const { queryText, fulfillmentText, intent, } = response;
			return fulfillmentText;
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
}

/**
 * Sends a text message to Whatsapp number
 * @param {string} number  Whatapp number on which message has to be delivered
 * @param {string} message text message
 */
async function sendMessageOnWhatsApp(number, message){
	try{
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

exports.whatsAppInquiry = (req, res) => whatsAppInquiry(req, res);
exports.whatsAppSendMessage = (req, res) => whatsAppSendMessage(req, res);