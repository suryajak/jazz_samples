/**
	Jazz cleanup service
	@Author: surya jakhotia
	@version: 1.0
**/

const configModule = require("./components/config.js");
const logger = require("./components/logger.js");
const errorHandlerModule = require("./components/error-handler.js");

module.exports.handler = (event, context, cb) => {

  const config = configModule.getConfig(event, context);
  const errorHandler = errorHandlerModule();
  logger.init(event, context);

  try {
    validateInput(config) 
    .then(function(result) {
      return cb(null,  {message: "Finished running cleanup"});
    })
    .catch(function(err) {
      logger.error(`Error during cleanup ${err}`);
      return cb(JSON.stringify(errorHandler.throwInternalServerError("Error during cleanup")));
    });

  } catch (e) {
    return cb(JSON.stringify(errorHandler.throwInternalServerError("Uncaught error during cleanup")));
  }
};

/**
 * validate Input data
 * @param {*} configData 
 */
function validateInput(configData) {

  return new Promise((resolve, reject) => {
    if (!configData.ADMIN_USERNAME) {
      reject("Error in configuration file: ADMIN_USERNAME is required");
    }
  
    if (!configData.ADMIN_PASSWORD) {
      reject("Error in configuration file: ADMIN_PASSWORD is required");
    }
  
    if (!configData.WHITELIST_SERVICES) {
      reject("Error in configuration file: WHITELIST_SERVICES is required");
    }

    if (!configData.JAZZ_INSTANCE_PREFIX) {
      reject("Error in configuration file. JAZZ_INSTANCE_PREFIX is required");
    }
  
    if (!configData.SERVICE_FILTER_PARAMS) {
      reject("Error in configuration file. SERVICE_FILTER_PARAMS is required");
    }

    if (!configData.SERVICE_RETURN_FIELDS) {
      reject("Error in configuration file. SERVICE_RETURN_FIELDS is required");
    }

    if (!configData.DDB_REGION) {
      reject("Error in configuration file. DDB_REGION is required");
    }

    if (!configData.SERVICE_EXPIRY_HOURS) {
      reject("Error in configuration file. SERVICE_EXPIRY_HOURS is required");
    }
    
    if (!configData.JAZZ_SERVICE_ENDPOINT) {
      reject("Error in configuration file. JAZZ_SERVICE_ENDPOINT is required");
    }

    if (!configData.JAZZ_LOGIN_API) {
      reject("Error in configuration file. JAZZ_LOGIN_API is required");
    }
    
    if (!configData.JAZZ_DELETE_API) {
      reject("Error in configuration file. JAZZ_DELETE_API is required");
    }

    resolve("Validation is successful");
  });
} 