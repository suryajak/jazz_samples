function ApiResponse(callback) {
    this.cb = callback;
}

ApiResponse.prototype.send = function(error, responseObject) {
    
    if(this.cb) {
        if (error) {
            return this.cb(error);
        }else {
            return this.cb(null, responseObject);
        }
    }
}

module.exports = ApiResponse;