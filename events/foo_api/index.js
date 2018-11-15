/**
NodeJS Project for APIs
@author: suryajak
@version: 1.0
 **/

const AWS = require('aws-sdk');
const dateFormatter = require("./utils/dateFormat");
const apiHelper = require("./api/apiHelper.js");

const errorHandlerModule = require("./components/error-handler.js");
const responseObj = require("./components/response.js");
const configModule = require("./components/config.js");
const logger = require("./components/logger.js");

//Initializations
const errorHandler = errorHandlerModule();

let api = new apiHelper();
api.get('/', handleBase);
api.get('/config', getConfig);
api.post('/config', updateConfig);

module.exports.handler = (event, context, cb) => {

  try {
    let config = configModule.getConfig(event, context);

    logger.init(event, context);
    logger.info(dateFormatter.epochNow());

    return api.run(event, config, cb);
  } catch (e) {
    logger.error(e);
    return cb(JSON.stringify(errorHandler.throwInternalServerError("Sample error message")));
  }
};

function getConfig(config, req, res) {
  if (req.query.i == 1) {
    res.send(responseObj({resp: "custom response for query parameter with i as 1", configObj: config}, {inputQuery: req.query, inputHeaders: req.headers}));
  } else {
    res.send(responseObj({resp: "standard response for getConfig"}, {inputQuery: req.query, inputHeaders: req.headers}));
  }
}

function updateConfig(config, req, res) {
  logger.info(`config object is ${config}`);
  res.send(responseObj({resp: "Successfully called updateConfig"}, {input: req.body}));
}

function handleBase(config, req, res) {
  logger.info(`Base path called`);
  res.send(responseObj({resp: "Base path called."}, {input: req.body}));
}