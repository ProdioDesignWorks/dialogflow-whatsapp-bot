const { axios } = require('../package-manager');
const { 
	WHATSAPP_SERVICE_API_BASE_PATH, WHATSAPP_SERVICE_TOKEN, 
	TRADE_WIZER_API_BASE_PATH, TRADE_WIZER_API_KEYS
} = require('../configs');

const whatsAppClient = axios.create({
	baseURL: WHATSAPP_SERVICE_API_BASE_PATH,
	headers: {
		'Content-Type': 'application/json'
	}
});

whatsAppClient.defaults.params = {
	token: WHATSAPP_SERVICE_TOKEN
};

const tradeWizerClient = axios.create({
	baseURL: TRADE_WIZER_API_BASE_PATH,
	headers: {
		'Content-Type': 'application/json'
	}
});

// Adding a request interceptor
tradeWizerClient.interceptors.request.use(
	config => addApiKeyHeader(config), 
	error => error
);

const addApiKeyHeader = config => {
	//for fun --> https://xkcd.com/221/
	config['headers']['Api-Key'] = TRADE_WIZER_API_KEYS[ Math.floor(Math.random() * TRADE_WIZER_API_KEYS.length) ];
	return config;
}

exports.whatsAppClient = whatsAppClient;
exports.tradeWizerClient = tradeWizerClient;