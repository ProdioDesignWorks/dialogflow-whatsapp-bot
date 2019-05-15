const googleConfig = require('./google.config.json');
const whatsAppConfig = require('./whatsapp.config.json');

const { project_id } = googleConfig;
const { WHATSAPP_SERVICE_API_BASE_PATH, WHATSAPP_SERVICE_TOKEN } = whatsAppConfig;

exports.googleConfig = googleConfig;
exports.PROJECT_ID = project_id;
exports.WHATSAPP_SERVICE_API_BASE_PATH = WHATSAPP_SERVICE_API_BASE_PATH;
exports.WHATSAPP_SERVICE_TOKEN = WHATSAPP_SERVICE_TOKEN;