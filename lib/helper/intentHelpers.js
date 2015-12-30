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

var DynamoDB = require('./dynamodb'),
    Config = require('../../config/lambda-config'),
    promise = require('bluebird'),
    Text = require('./text');


if (!process.env.SERVER || process.env.SERVER !== 'Local') {    // Provide long stack traces when running locally (in active development mode)
    promise.longStackTraces();
}

var intentFuncs = {
    handleAppIntent: function (request, response) {
        var slotThing = request.slot('SlotName', 'default'),
            failed = false;

        function log() {
            DynamoDB.log(slotThing, request.userId);
        }

        // Failure path for intent
        if (failed) {
            response
                .say(Text.failedResponse)
                .card('Problem', Text.failedResponse)
                .shouldEndSession(true)
                .send();

            return promise.reject();
        }

        response
            .say(Text.defaultResponse)
            .card(Config.applicationName, Text.defaultResponse)
            .shouldEndSession(true);

        if (!process.env.SERVER || process.env.SERVER !== 'Local') {    // Don't log in active development mode
            log();
        }

        return promise.resolve();
    }
};

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;
module.exports = intentFuncs;
