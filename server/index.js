const app = require('./app');
const defaultRoutes = require('../routes/default.routes');
const whatsAppRoutes = require('../routes/whatsapp.routes');

function serverStarted(){
	console.log(`server started on port ${port}`);
}

/**
 * Grab the application port number
 */
const port = app.get('port');

/**
 * Register the application routes
 */
app.use('/', defaultRoutes);
app.use('/ping', defaultRoutes);
app.use('/whatsapp', whatsAppRoutes);

/**
 * Launch the application server
 */
app.listen(port, serverStarted);