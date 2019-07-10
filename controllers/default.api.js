/**
 * Ping API of the server which can be used for the purpose of health checks
 * @param {object} req express request object
 * @param {object} res express request object

 */
async function ping(req, res){
	try {
        return res.status(200).send(`Server is up & running at ${new Date()}!`);
    } catch (error) {
        return res.status(500).send(`Sorry! An unexpected error occurred on the error`);
    }
}

exports.ping = (req, res) => ping(req, res);