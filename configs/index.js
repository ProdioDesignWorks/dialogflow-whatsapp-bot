const playydateGoogleConfig = require('./playydate.google.config.json');
const tradewizerGoogleConfig = require('./tradewizer.google.config.json');
const whatsAppConfig = require('./whatsapp.config.json');

const { project_id: playydateProjectId } = playydateGoogleConfig;
const { project_id: tradewizerProjectId } = tradewizerGoogleConfig;
const { WHATSAPP_SERVICE_API_BASE_PATH, WHATSAPP_SERVICE_TOKEN } = whatsAppConfig;

exports.playydateGoogleConfig = playydateGoogleConfig;
exports.tradewizerGoogleConfig = tradewizerGoogleConfig;
exports.PLAYYDATE_PROJECT_ID = playydateProjectId;
exports.TRADEWIZER_PROJECT_ID = tradewizerProjectId;
exports.WHATSAPP_SERVICE_API_BASE_PATH = WHATSAPP_SERVICE_API_BASE_PATH;
exports.WHATSAPP_SERVICE_TOKEN = WHATSAPP_SERVICE_TOKEN;
exports.googleConfigs = {
	[playydateProjectId]: playydateGoogleConfig,
	[tradewizerProjectId]: tradewizerGoogleConfig,
};