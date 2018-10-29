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