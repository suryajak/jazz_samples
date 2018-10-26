const apiResponse = require("./apiResponse");

function ApiHelper() {
    this.routes = {};
}

ApiHelper.prototype.get = function(path, fn) {
    addRoute(this.routes, "get", path, fn);
}

ApiHelper.prototype.post = function(path, fn) {
    addRoute(this.routes, "post", path, fn);
}

ApiHelper.prototype.put = function(path, fn) {
    addRoute(this.routes, "put", path, fn);
}

ApiHelper.prototype.delete = function(path, fn) {
    addRoute(this.routes, "delete", path, fn);
}

ApiHelper.prototype.run = function(event, callback) {
    let req = {};
    var self = this;
    if (event) {
        req.method = event.method.toLowerCase();
        req.query = event.query;
        req.path = event.path;
        req.headers = event.headers;
        req.rawBody = event.body;
    }

    if (this.routes[req.method]){
        let response = new apiResponse(callback);

        if (this.routes[req.method][req.path]) {// exact match
            this.routes[req.method][req.path]["handler"](req, response);
        }
    }
}

function addRoute(routes, method, path, fn) {
    if (!routes[method]) {
        routes[method] = {};
    } 

    if (routes[method][path]) {
        routes[method][path][handler] = fn;
    } else {
        routes[method][path] = {
            handler: fn
        };
    }
}

module.exports = ApiHelper;