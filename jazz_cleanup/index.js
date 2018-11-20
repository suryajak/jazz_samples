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
    return cb(null,  {message: "Finished running cleanup"});

  } catch (e) {
    return cb(JSON.stringify(errorHandler.throwInternalServerError("Uncaught error during cleanup")));
  }
};
