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
    Config = require('../../config/lambda-config'),
    promise = require('bluebird'),
    invokeLambdaHelper = {};

AWS.config.update({region:  Config.region});

var lambda = new AWS.Lambda();
promise.promisifyAll(Object.getPrototypeOf(lambda), {suffix: '_Async'});

invokeLambdaHelper.invoke = function (payload) {
    var call,
        params = {
            FunctionName: Config.functionName, /* required */
            //ClientContext: 'STRING_VALUE',
            //InvocationType: 'Event | RequestResponse | DryRun',
            //LogType: 'None | Tail',
            Payload: JSON.stringify(payload, null, 2)
            //Qualifier: 'STRING_VALUE'
        };

    call = lambda.invoke_Async(params);
    return call
        .then(function (data) {
            return (JSON.parse(data.Payload));
        })
        .then(function (data) {
            if (data.response && data.response.outputSpeech) {
                return (data.response.outputSpeech.ssml);
            }

            throw 'bad response';   // TODO: Uncertain what to do here
        })
        .catch(function (err) {
            throw err;
        });
};

module.exports = invokeLambdaHelper;
