/**
	@module: apiHelper.js
    @description: helper module to parse and process api request
	@author: suryajak
	@version: 1.0
**/
const apiResponse = require("./apiResponse");
const router = require("./router");
const errorHandlerModule = require("../components/error-handler"); 

class ApiHelper {
    constructor() {
        this.router = new router();
        this.errorHandler = errorHandlerModule();
    }

    run(event, config, callback) {
        let req = {};
    
        if (event) {
            // path for prod /api/{namespace}/{service_name} and for non-prod /api/{env_id}/{namespace}/{service_name}
            let servicePathBaseIndex = config && config.env && config.env === 'dev' ? 5: 4;  
            let relativePathArray = event && event.resourcePath ? event.resourcePath.split('/').splice(servicePathBaseIndex) : []; 

            req.method = event.method.toLowerCase();
            req.query = event.query;
            req.path = `/${relativePathArray.join("/")}`;
            req.headers = event.headers;
            req.rawBody = event.body;
        }
        let handler = this.router.resolve(req.method, req.path);

        if (handler){
            let response = new apiResponse(callback);
            
            handler(config, req, response);
        }else {
            return callback(JSON.stringify(this.errorHandler.throwNotFoundError("No handler matches path " + req.path)));
        }
    }

    get(path, fn) {
        this.router.add("get", path, fn);
    }

    post(path, fn) {
        this.router.add("post", path, fn);
    }

    put(path, fn) {
        this.router.add("put", path, fn);
    }

    delete(path, fn) {
        this.router.add("delete", path, fn);
    }
}

module.exports = ApiHelper;