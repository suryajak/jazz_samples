/**
Nodejs Template Project
@author:
@version: 1.0
 **/

const AWS = require('aws-sdk');
const dateFormatter = require("./utils/dateFormat");
const apiHelper = require("./utils/apiHelper.js");

const errorHandlerModule = require("./components/error-handler.js");
const responseObj = require("./components/response.js");
const configModule = require("./components/config.js");
const logger = require("./components/logger.js");

//Initializations
const errorHandler = errorHandlerModule();

let api = new apiHelper();
api.get('/sendm', updateDocumentDB);
api.post('/update', updateApi);

module.exports.handler = (event, context, cb) => {

  try {
    let config = configModule.getConfig(event, context);

    logger.init(event, context);
    logger.info(dateFormatter.epochNow());

    return api.run(event, cb);
  } catch (e) {
    logger.error(e);
    return cb(JSON.stringify(errorHandler.throwInternalServerError("Sample error message")));
  }
};

function updateDocumentDB(req, res) {
  if (req.query.i == 1) {
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
    
    res.send(null, responseObj({resp: "custom response"}, {inputQuery: req.query, inputHeaders: req.headers}));
  }
}

function updateApi(req, res) {
  res.send(null, responseObj({resp: "Successfully called updateAPI"}, {input: req.body}));
}