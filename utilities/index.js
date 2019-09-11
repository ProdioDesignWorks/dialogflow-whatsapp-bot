const { url, path } = require('../package-manager');

function getErrorStatus(error) {
	try {
		const statusCode = error.response.status;
		return statusCode;
	} catch(error) {
		return 500;
	}
}

function isIndianPhoneNumber(number) {
	try {
		/**
		 * 1) Matches country code
		 * 2) starts with 7 or 8 or 9. 
		 * 3) contains 9 digits 
		 */
		if(number.length < 10){
			return false;
		}
		// const pattern = new RegExp("[7-9][0-9]{9}");
		const pattern = new RegExp("([0|\+[0-9]{1,5})?([7-9][0-9]{9})");
		return pattern.test(number);
	} catch (error) {
		throw error;
	}
}

function getFileName(fileUrl) {
	const parsed = url.parse(fileUrl);
	return path.basename(parsed.pathname);
}

exports.getErrorStatus = (error) => getErrorStatus(error);
exports.isIndianPhoneNumber = (number) => isIndianPhoneNumber(number);
exports.getFileName = (url) => getFileName(url);