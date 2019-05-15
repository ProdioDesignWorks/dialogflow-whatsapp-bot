const app = require('./app');
const { whatsAppInquiry } = require('../controllers/whatsapp.api');

function serverStarted(){
	console.log(`server started on port ${app.get('port')}`);
}

function ping(req, res){
	res.send('It works!');
}

app.get('/', ping);

app.get('/ping', ping);

app.post('/whatsapp/query', whatsAppInquiry);

app.listen(app.get('port'), serverStarted);