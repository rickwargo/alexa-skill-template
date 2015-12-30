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

var AlexaSkill = (process.env.SERVER && process.env.SERVER === 'Local') ? require('./invokeLocal') : require('./invokeLambda');

var Config = require('../../config/lambda-config'),
    JSONtemplate = require('../inputs/request.json'),
    requestHelper = {};

function requestJSON(intent) {
    var json = JSON.parse(JSON.stringify(JSONtemplate));

    json.session.application.applicationId = Config.applicationId;
    json.session.application.timestamp = new Date().toISOString();
    json.request.timestamp = new Date().toISOString();
    if (intent) { json.request.intent = intent; }

    return json;
}

function launchJSON() {
    var json = requestJSON();

    json.request.type = 'LaunchRequest';
    json.session.new = true;
    return json;
}

// Generic unit test to see if it handles a bad application Id
requestHelper.badAppId = function () {
    var payload = launchJSON();

    payload.session.application.applicationId = 'amzn1.echo-sdk-ams.app.000000-0000-0000-0000-000000000000';
    return AlexaSkill.invoke(payload);
};

// Generic unit test to see if it handles capturing the text from starting up
requestHelper.launchRequest = function () {
    var payload = launchJSON();

    return AlexaSkill.invoke(payload);
};

requestHelper.intentRequest = function (intent) {
    var payload = requestJSON(intent);

    return AlexaSkill.invoke(payload);
};

module.exports = requestHelper;
