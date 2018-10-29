const apiResponse = require("./apiResponse");

class ApiHelper {
    constructor() {
        this.routes = {};
    }

    run(event, callback) {
        let req = {};
    
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

    get(path, fn) {
        this.addRoute(this.routes, "get", path, fn);
    }

    post(path, fn) {
        this.addRoute(this.routes, "post", path, fn);
    }

    put(path, fn) {
        this.addRoute(this.routes, "put", path, fn);
    }

    delete(path, fn) {
        this.addRoute(this.routes, "delete", path, fn);
    }

    addRoute(routes, method, path, fn) {
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
}

module.exports = ApiHelper;