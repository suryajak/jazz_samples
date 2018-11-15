/**
	@module: apiHelper.js
    @description: helper module to parse and process api requests
	@author:
	@version: 1.0
**/
const apiResponse = require("./apiResponse");
const errorHandlerModule = require("../components/error-handler"); 

class ApiHelper {
    constructor() {
        this.routes = {};
        this.errorHandler = errorHandlerModule();
    }

    run(event, config, callback) {
        let req = {};
    
        if (event) {
            // path for prod /api/{namespace}/{service_name} and for non-prod /api/{env_id}/{namespace}/{service_name}
            let requestPathIndex = config && config.env && config.env === 'dev' ? 5: 4;  

            req.method = event.method.toLowerCase();
            req.query = event.query;
            req.path = `/${event.resourcePath.split('/').splice(requestPathIndex).join("/")}`;
            req.headers = event.headers;
            req.rawBody = event.body;
        }

        if (this.routes[req.method]){
            let response = new apiResponse(callback);

            if (this.routes[req.method][req.path]) {// exact match
                this.routes[req.method][req.path]["handler"](config, req, response);
            }else {
                return callback(JSON.stringify(this.errorHandler.throwInternalServerError("No handler matches path " + req.path)));
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
            routes[method][path]["handler"] = fn;
        } else {
            routes[method][path] = {
                "handler": fn
            };
        }
    }
}

module.exports = ApiHelper;