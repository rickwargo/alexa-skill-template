////////////////////////////////////////////////////////////////////////////////
// Copyright (c) 2015-2016 Rick Wargo. All Rights Reserved.
//
// Licensed under the MIT License (the "License"). You may not use this file
// except in compliance with the License. A copy of the License is located at
// http://opensource.org/licenses/MIT or in the "LICENSE" file accompanying
// this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
// OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.
////////////////////////////////////////////////////////////////////////////////

/*jslint node: true */
/*jslint todo: true */
'use strict';

var AWS = require('aws-sdk'),
    Config = require('../config/lambda-config');
AWS.config.update({region: Config.region});


var dynamodb = new AWS.DynamoDB();

var params = {
    TableName :  Config.namespace + 'ActivityLog',
    KeySchema: [
        { AttributeName: 'Key', KeyType: 'HASH'},  //Partition key
        { AttributeName: 'When', KeyType: 'RANGE' }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: 'Key', AttributeType: 'S' },
        { AttributeName: 'When', AttributeType: 'N' }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

dynamodb.createTable(params, function (err, data) {
    if (err) {
        console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
    }
});
