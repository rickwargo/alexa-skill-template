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
/*jslint unparam: true*/
'use strict';

// Update the AWS Region once in the beginning
var AWS = require('aws-sdk'),
    Config = require('./config/lambda-config');
AWS.config.update({region: Config.region});

var Alexa = require('./vendor/alexa-app'),
    IntentHelpers = require('./lib/helper/intentHelpers'),
    Text = require('./lib/helper/text');

// Define an alexa-app
var alexaApp = new Alexa.app(Config.applicationName);

alexaApp.launch(function (request, response) {
    response
        .say(Text.setupPrompt)
        .shouldEndSession(false, Text.simpleHelp);
});

// Ensure it is our intended application sending the requests
alexaApp.pre = function (request, response, type) {
    if (request.sessionDetails.application.applicationId !== Config.applicationId) {
        // Fail ungracefully
        throw 'Invalid applicationId: ' + request.sessionDetails.application.applicationId;
    }
};

// To keep the intents() code size small, most of the work is moved to a Helper function
function appIntentHelper(request, response) {
    function allGood(response) {
        response.send();
    }

    function oops(response) {
        response
            .clear()
            .say(Text.failedResponse)
            .shouldEndSession(true);
    }

    IntentHelpers.handleAppIntent(request, response)
        .then(function () { allGood(response); })
        .catch(function () { oops(response); });
}

alexaApp.intent('AppIntent',
    {
        'slots': {
            'SlotName': 'LIST_OF_SLOTTHINGS'
        },
        'slot_types': [
            {
                'name': 'SlotName',
                'values': ['slotthing1', 'slotthing2', 'slotthing3', 'slotthing4']
            }
        ],
        'utterances': [
            'this is an utterance'
        ]
    },
    function (request, response) {
        appIntentHelper(request, response);

        return false;   // Using a promise/asynchronous model for completion. Return false to handle ourselves.
    });

// Following are the default intents (delete the unused intents if desired)
alexaApp.intent('AMAZON.CancelIntent',
    function (request, response) {
        response
            .say(Text.goodbye)          // Or cancel a transaction or task (but remain in the skill)
            .shouldEndSession(true);
    });

alexaApp.intent('AMAZON.HelpIntent',
    function (request, response) {
        response
            .say(Text.helpText)
            .shouldEndSession(false, Text.simpleHelp);
    });

alexaApp.intent('AMAZON.YesIntent',
    function (request, response) {
        response
            .say('Let the user provide a positive response to a yes/no question for confirmation.')
            .shouldEndSession(false, Text.simpleHelp);
    });

alexaApp.intent('AMAZON.NoIntent',
    function (request, response) {
        response
            .say('Let the user provide a negative response to a yes/no question for confirmation.')
            .shouldEndSession(false, Text.simpleHelp);
    });

alexaApp.intent('AMAZON.RepeatIntent',
    function (request, response) {
        response
            .say('Let the user request to repeat the last action.')
            .shouldEndSession(false, Text.simpleHelp);
    });

alexaApp.intent('AMAZON.StartOverIntent',
    function (request, response) {
        response
            .say('Let the user request to restart an action, such as restarting a game or a transaction.')
            .shouldEndSession(false, Text.simpleHelp);
    });

alexaApp.intent('AMAZON.StopIntent',
    function (request, response) {
        response
            .say(Text.goodbye)              // Or let the user stop an action (but remain in the skill)
            .shouldEndSession(true);
    });

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;
module.exports = alexaApp;
