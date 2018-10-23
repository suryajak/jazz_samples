/**
Nodejs Template Project
@author:
@version: 1.0
 **/

const AWS = require('aws-sdk');
const dateFormatter = require("./utils/dateFormat");

const errorHandlerModule = require("./components/error-handler.js");
const responseObj = require("./components/response.js");
const configModule = require("./components/config.js");
const logger = require("./components/logger.js");

module.exports.handler = (event, context, cb) => {

  //Initializations
  const errorHandler = errorHandlerModule();
  const config = configModule.getConfig(event, context);
  logger.init(event, context);
  logger.info(dateFormatter.epochNow());

  try {    //Your GET method should be handled here
    if (event && event.method && event.method === 'GET') {
      
      if (event.query && event.query.i == 1) {
        let timestamp = dateFormatter.epochNow();
        let docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
          TableName: "test_table",
          Item: {
            "pKey": "This is my test sample",
            "column1": dateFormatter.epochNow()
          }
        };
        
        docClient.put(params, function(err, data) {
          if (err) {
            logger.error(err);
          } else {
            return cb(null, responseObj(data, {inputRecords: records.length}));
          }
        });
      }

      return cb(null, responseObj(sampleResponse, event.query));
    }

    //Your POST method should be handled here
    if (event && event.method && event.method === 'POST') {
      return cb(null, responseObj(sampleResponse, event.body));
    }

  } catch (e) {
    //Sample Error response for internal server error
    return cb(JSON.stringify(errorHandler.throwInternalServerError("Sample message")));

    //Sample Error response for Not Found Error
    //cb(JSON.stringify(errorHandler.throwNotFoundError("Sample message")));

    //Sample Error response for Input Validation Error
    //cb(JSON.stringify(errorHandler.throwInputValidationError("Sample message")));
  }

};
