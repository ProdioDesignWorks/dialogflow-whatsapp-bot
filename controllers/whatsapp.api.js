const { uuid, } = require('../package-manager');
const { queryDialogflow } = require('./dialogflow.api');
const { sendWhatsAppMessage, sendWhatsAppFileMessage, fetchSubscriberBusiness } = require('../apis');
const playydateUsers = require('../configs/play-date-users.json');
const { getErrorStatus, isIndianPhoneNumber, getFileName } = require('../utilities');

const executeSerially = funcs =>
    funcs.reduce((promise, func) =>
        promise.then(result => func().then(Array.prototype.concat.bind(result))), Promise.resolve([]))

/**
 * Accepts request from whatsapp server and process the inquiry.
 * This API processes the whatsapp inquiry of a subscriber
 * @param {object} req express request object
 * @param {object} res express response object
 */
async function whatsAppInquiry(req, res) {
	try{
		const { body: reqBody } = req;
		const { messages } = reqBody;

		if(messages.length){
			const message = messages[0];
			const { body, senderName, chatName, fromMe, chatId } = message;

			if (fromMe) {
				//This message was triggered by whatsapp bot because
				//If I'll send msg to someone, then also it's treated as an event and sent on this webhook
				//which results in an infinite loop or recursion
				return res.status(200).send('Self triggered message, ignored!');
			}

			// Remove all white spaces from number
			// const senderNumber = chatName.replace(/ /g,'');
			// const number = senderNumber.substring(3, senderNumber.length);
			
			const senderNumber = chatId.split('@')[0];
			const number = senderNumber.substring(2, senderNumber.length);

			const queryResponses = await whatsAppProcessQuery({ senderName, number, text: body });
			const seriesExecution = queryResponses.map(
				queryResponse => () => sendMessageOnWhatsApp(`+91${number}`, queryResponse.fulfillmentText)
			);
			await executeSerially(seriesExecution);

			return res.status(200).send('Ok');
		} else {
			return res.status(400).send('No new messages received');
		}
	} catch (error) {
		console.error(error);
		const message = error.message || 'Something went wrong!';
		return res.status(500).send(message);
	}
}

/**
 * Sends a text message to Whatsapp number
 * @param {object} req express request object
 * @param {object} res express response object
 */
async function whatsAppSendMessage(req, res) {
	try{
		const { body } = req;
		const { number = '', message = '' } = body;

		if (!message.length) {
			return res.status(400).send('Empty message');
		}

		if (!isIndianPhoneNumber(number)) {
			return res.status(400).send('Invalid contact number');
		}

		// To extract only contact number from a number even if country code is present
		//Works for +91, 91, and, 0
		const contactNumber = number.slice(-10);

		await sendMessageOnWhatsApp(`+91${contactNumber}`, message);
		return res.status(200).send('Ok');
	} catch (error) {
		const message = error.message || 'Something went wrong!';
		return res.status(500).send(message);
	}
}

/**
 * Sends a file to Whatsapp number
 * @param {object} req express request object
 * @param {object} res express response object
 */
async function whatsAppSendFile(req, res) {
	try{
		const { body } = req;
		const { number = '', file = '', fileName = '' } = body;

		if (!isIndianPhoneNumber(number)) {
			return res.status(400).send('Invalid contact number');
		}

		if (!file.length) {
			return res.status(400).send('Invalid file');	
		}

		let generatedFileName = fileName;
		if (!fileName.length) {
			generatedFileName = getFileName(file);
		}

		// To extract only contact number from a number even if country code is present
		//Works for +91, 91, and, 0
		const contactNumber = number.slice(-10);

		await sendWhatsAppFileMessage(`+91${contactNumber}`, generatedFileName, file);
		return res.status(200).send('Ok');
	} catch (error) {
		const message = error.message || 'Something went wrong!';
		return res.status(500).send(message);
	}
}

/**
 * Fetches the business of Whatsapp subscriber
 * @param {string} number     Whatapp number of the subscriber
 */
async function fetchBusiness(number) {
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
async function whatsAppProcessQuery({ senderName = '', number, text = ''}) {
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
			// const { queryText, fulfillmentText, intent, } = response;
			// return fulfillmentText;
			console.log("multiple")
			return response;
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
async function sendMessageOnWhatsApp(number, message) {
	try{
		console.log("number:", number);
		console.log("message:", message);
		const { data } = await sendWhatsAppMessage(number, message);
		const { sent } = data;
		if (sent) {
			console.log("sent:", sent);
			return 'Ok';
		} else {
			throw new Error('WhatsApp API service not responding!');
		}
	} catch (error) {
		throw error;
	}
}

/**
 * Accepts request from the service
 * This API initializes the whatsapp conversation by sending the msg first to bot and,
 * forwarding the bot reply to specific user
 * @param {object} req express request object
 * @param {object} res express response object
 */
async function whatsAppStartCoversation(req, res) {
	try {
		const { body } = req;
		const { number = '', message = '' } = body;

		if (!message.length) {
			return res.status(400).send('Empty message');
		}

		if (!isIndianPhoneNumber(number)) {
			return res.status(400).send('Invalid contact number');
		}

		// To extract only contact number from a number even if country code is present
		//Works for +91, 91, and, 0
		const contactNumber = number.slice(-10);

		const queryResponses = await whatsAppProcessQuery({ number: contactNumber, text: message });
		const seriesExecution = queryResponses.map(
			queryResponse => () => sendMessageOnWhatsApp(`+91${contactNumber}`, queryResponse.fulfillmentText)
		);
		await executeSerially(seriesExecution);
		
		return res.status(200).send('Ok');
	} catch (error) {
		const message = error.message || 'Internal Server Error';
		return res.status(500).send(message);
	}
}

exports.whatsAppInquiry = (req, res) => whatsAppInquiry(req, res);
exports.whatsAppSendMessage = (req, res) => whatsAppSendMessage(req, res);
exports.whatsAppStartCoversation = (req, res) => whatsAppStartCoversation(req, res);
exports.whatsAppSendFile = (req, res) => whatsAppSendFile(req, res);