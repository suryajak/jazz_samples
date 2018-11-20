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

  let whitelistedServices;

  try {
    validateInput(config)
    .then(() => {
      whitelistedServices = getWhitelistedServicesMap(config.WHITELIST_SERVICES);
    })
    .then(() => {
      return dbbUtil(config.DDB_REGION, config.JAZZ_INSTANCE_PREFIX + "_services_prod", config.SERVICE_FILTER_PARAMS, config.SERVICE_RETURN_FIELDS, {"status": "active"});
    })
    .then(function(servicesInfo){
      if (servicesInfo) {
        var today = new Date();
        var maxCreatedDate = today.setHours(today.getHours() - config.SERVICE_EXPIRY_HOURS);
        let rslt = [];

        for (let service of servicesInfo) {
          if (rslt.length >= config.MAX_SERVICES_TO_DELETE) {
            break;
          }

          if (service.domain &&  moment(service.timestamp, 'YYYY-MM-DDTHH:mm:ss:SSS').isBefore(maxCreatedDate)) {
            // service is beyond its expiry date, lets check if it is whitelisted
            if (whitelistedServices[service.domain]) {
              if (whitelistedServices[service.domain] != '*') {
                var wsServices = whitelistedServices[service.domain].split(',');
                if (!_.includes(wsServices, service.service)) {
                  rslt.push({"d": service.domain, "s": service.service});
                }
              }
            } else {
              rslt.push({"d": service.domain, "s": service.service});
            }
          } 
        }

        return rslt;
      }
    })
    .then(function(result) {
      if (result) {
        deleteServices = result;

        return rp(getLoginRequest(config));
      }
    })
    .then(function(authHeader){
      if (authHeader) {
        
        return Promise.all(deleteServices.map(function (elem){
          logger.info(`Ready to submit request for deleting service "${elem.s}" in domain ${elem.d}`);
          return rp(postServiceDeleteRequest(config, authHeader, elem.d, elem.s));
        }));
      }
    })
    .then(function(result) {
      logger.info(`Cleanup result: ${JSON.stringify(result)}`);
      return cb(null, {message: "Finished running cleanup"});
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

/**
 * get map of whitelisted services
 * @param {*} whitelistedServices 
 */
function getWhitelistedServicesMap(whitelistedServices) {
  return whitelistedServices.split(';').map(a => a.split(':')).reduce(function(map, obj) 
    {
      if (!map[obj[0]]) {
        map[obj[0]] = obj[1];
      }else {
        map[obj[0]] = map[obj[0]] + ',' + obj[1];
      } 
      return map;
    }, {});
}

/**
 * gets login request payload
 * @param {*} configData 
 */
function getLoginRequest(configData) {
  return {
    uri: configData.JAZZ_SERVICE_ENDPOINT + configData.JAZZ_LOGIN_API,
    method: 'POST',
    json: {
      "username": configData.ADMIN_USERNAME,
      "password": configData.ADMIN_PASSWORD
    },
    rejectUnauthorized: false,
    transform: function(body, response, resolveWithFullResponse) {
      return body.data.token; 
    }
  };
}

/**
 * Gets payload for posting a service delete request
 * @param {*} configData 
 * @param {*} authHeader 
 * @param {*} domain 
 * @param {*} service 
 */
function postServiceDeleteRequest(configData, authHeader, domain, service) {
  return {
      uri: configData.JAZZ_SERVICE_ENDPOINT + configData.JAZZ_DELETE_API,
      headers: {'Authorization': authHeader},
      method: 'POST',
      json: {
        "domain": domain,
        "service_name": service
      },
      rejectUnauthorized: false
    };
}