const { express, bodyParser, } = require('../package-manager');

const app = express();
const port = process.env.WHATSAPP_APPLICATION_PORT || 3001;

// parse body params and attach them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', port);

module.exports = app;