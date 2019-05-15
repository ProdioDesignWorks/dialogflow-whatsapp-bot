const { axios } = require('../package-manager');
const { WHATSAPP_SERVICE_API_BASE_PATH, WHATSAPP_SERVICE_TOKEN, } = require('../configs');

const client = axios.create({
	baseURL: WHATSAPP_SERVICE_API_BASE_PATH,
	headers: {
		'Content-Type': 'application/json'
	}
});

client.defaults.params = {
	token: WHATSAPP_SERVICE_TOKEN
};

exports.client = client;