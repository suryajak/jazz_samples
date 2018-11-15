/**
	@module: ApiResponse.js
    @description: Class to handle API Responses
	@author: suryajak
	@version: 1.0
**/
class ApiResponse {
    constructor(callback) {
        this.cb = callback;
    }

    send(responseObject) {
        if (this.cb) {
            return this.cb(null, responseObject);
        }
    }

    error(error) {
        if (this.cb) {
            if (error) {
                return this.cb(error);
            }
        }
    }
}

module.exports = ApiResponse;