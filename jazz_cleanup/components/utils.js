/**
    Helper functions for Service-Catalog
    @module: utils.js
    @description: Defines functions like format the output as per Service-Catalog schema etc.
    @author: 
    @version: 1.0
**/

const AWS = require('aws-sdk');

/**
 * function to convert key name in schema to database column name
 * @param {*} key 
 */
var getDatabaseKeyName = function(key) {
    if (!key) return null;

    if (key === 'service') {
        return 'SERVICE_NAME';
    } else {
        return 'SERVICE_' + key.toUpperCase();
    }
};

/**
 * convert object returned from the database, as per schema
 * @param {*} service 
 * @param {*} format 
 */
var formatService = function(service, fields, format) {
    if (!service) return {};
    
    var service_obj;

    if (format) {
        service_obj = {
            'id': service.SERVICE_ID.S,
            'timestamp': service.TIMESTAMP.S
        };
    } else {
        service_obj = {
            'id': service.SERVICE_ID,
            'timestamp': service.TIMESTAMP
        };
    }

    var parseValue = function(value) {
        var type = Object.keys(value)[0];
        var parsed_value = value[type];
        if (type === 'NULL') {
            return null;
        } else if (type === 'N') {
            return Number(value);
        } else if (type === 'NS') {
            return parsed_value.map(Number);
        } else if (type === 'S') {
            return parsed_value;
        } else if (type === 'SS') {
            return parsed_value;
        } else if (type === 'M') {
            var parsed_value_map = {};
            try {
                Object.keys(parsed_value).forEach(function(key) {
                    parsed_value_map[key] =  parseValue(parsed_value[key]);
                });
            } catch (e) {}
            return parsed_value_map;
        } else if (type === 'L') {
            var parsed_value_list = [];
            try {
                for (var i = 0; i < parsed_value.length; i++) {
                    parsed_value_list.push(parseValue(parsed_value[i]));
                }
            } catch (e) {}
            return parsed_value_list;
        } else {
            // probably should be error
            return (parsed_value);
        }
    };

    fields.forEach(function(key) {
        var key_name = getDatabaseKeyName(key);
        var value = service[key_name];
        if (value) {
            if (format) {
                service_obj[key] = parseValue(value);
            } else {
                service_obj[key] = (value);
            }
        }
    });

    return service_obj;
};

/**
 * Initialize document client for dynamodb
 */
var initDocClient = function(region) {
    AWS.config.update({ region: region });
    var docClient = new AWS.DynamoDB.DocumentClient();

    return docClient;
};

var initDynamodb = function(region) {
    AWS.config.update({ region: region });
    var dynamodb = new AWS.DynamoDB();

    return dynamodb;
};

module.exports = () => {
    return {
        initDynamodb: initDynamodb,
        initDocClient: initDocClient,
        getDatabaseKeyName: getDatabaseKeyName,
        formatService: formatService
    };
};
