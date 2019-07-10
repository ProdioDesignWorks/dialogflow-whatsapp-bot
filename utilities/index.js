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
		 * 1) starts with 7 or 8 or 9. 
		 * 2) contains 9 digits 
		 */
		if(number.length > 10){
			return false;
		}
		const pattern = new RegExp("[7-9][0-9]{9}");
		return pattern.test(number);
	} catch (error) {
		throw error;
	}
}

exports.getErrorStatus = (error) => getErrorStatus(error);
exports.isIndianPhoneNumber = (number) => isIndianPhoneNumber(number);