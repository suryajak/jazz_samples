/**
    Helper functions for dynamodb scan
    @module: ddbscan.js
    @description: Defines functions like format the output as per Service-Catalog schema etc.
    @author: 
    @version: 1.0
**/
const utils = require("./utils")();

module.exports = (region, tableName, filterParams, fields, query) => {
    
    return new Promise((resolve, reject) => {
        let dynamodb = utils.initDynamodb(region);

        let filter = "";
        let attributeValues = {};
        let insertAnd = " AND ";

        let scanparams = {
            "TableName": tableName,
            "ReturnConsumedCapacity": "TOTAL",
            "Limit": "500"
        };

        if (query) {
            
            let keys_list = filterParams;

            keys_list.forEach(function (key) {
                
                let key_name = utils.getDatabaseKeyName(key);

                if (key_name == "SERVICE_TIMESTAMP" && (query.last_updated_after || query.last_updated_before)) {
                    filter = filter + key_name + " BETWEEN :BEFORE" + " AND :AFTER " + insertAnd;
                    attributeValues[(":BEFORE")] = {
                        'S': query.last_updated_before
                    };
                    attributeValues[(":AFTER")] = {
                        'S': query.last_updated_after
                    };
                } else if (query[key]) {
                    filter = filter + key_name + " = :" + key_name + insertAnd;
                    attributeValues[(":" + key_name)] = {
                        'S': query[key]
                    };
                }   
            });
        }

        if (filter !== "") {
            filter = filter.substring(0, filter.length - insertAnd.length); // remove insertAnd at the end

            scanparams.FilterExpression = filter;
            scanparams.ExpressionAttributeValues = attributeValues;
        }

        let results = [];
        query.limit = query.limit || 10;
        query.offset = query.offset || 0;

        let scanExecute = function() {
           dynamodb.scan(scanparams, function(err, items) {
                if (err) {
                    reject(err);
                } else {
                    items.Items.forEach(function(item) {
                        results.push(utils.formatService(item, fields, true));
                    });
                    
                    if (items.LastEvaluatedKey) {
                        scanparams.ExclusiveStartKey = items.LastEvaluatedKey;
                        scanExecute();
                    } else {
                        resolve(results);
                    }
                }
            });
        };

        scanExecute();
    });
};

