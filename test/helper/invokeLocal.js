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

var requestPromise = require('request-promise'),
    Server = require('../../../../server'),
    Config = require('../../config/lambda-config'),
    invokeLocalHelper = {};

invokeLocalHelper.invoke = function (payload) {
    var call = requestPromise({
        method: 'POST',
        uri: 'http://localhost:8003/alexa/' + Config.applicationName,
        json: payload
    });

    return call
        .then(function (data) {
            if (data.response && data.response.outputSpeech) {
                return data.response.outputSpeech.ssml;
            }
            throw 'bad response';
        })
        .catch(function (err) {
            throw err;
        });
};

module.exports = invokeLocalHelper;
