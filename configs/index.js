const whatsAppConfig = require('./whatsapp.config.json');
const tradeWizerConfig = require('./tradewizer.config.json');
const botsConfig = require('./bots.config.json');

const { WHATSAPP_SERVICE_API_BASE_PATH, WHATSAPP_SERVICE_TOKEN } = whatsAppConfig;
const { TRADE_WIZER_API_BASE_PATH, API_KEYS } = tradeWizerConfig;

exports.businessBotsConfig = botsConfig;
exports.WHATSAPP_SERVICE_API_BASE_PATH = WHATSAPP_SERVICE_API_BASE_PATH;
exports.WHATSAPP_SERVICE_TOKEN = WHATSAPP_SERVICE_TOKEN;
exports.TRADE_WIZER_API_BASE_PATH = TRADE_WIZER_API_BASE_PATH;
exports.TRADE_WIZER_API_KEYS = API_KEYS;