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
/*global describe */
/*global it */

'use strict';

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    should = require('chai').should(),
    request = require('./helper/request'),
    Text = require('../lib/helper/text');

chai.use(chaiAsPromised);


describe('starting up', function () {
    it('should fail if an unknown application id is provided', function () {
        var result = request.badAppId();
        return result.should.eventually.be.rejected;
    });

    it('should respond what to ask for', function () {
        var result = request.launchRequest();
        return result.should.eventually.equal('<speak>' + Text.setupPrompt + '</speak>');
    });
});

describe('the initial intent', function () {
    it('should respond with a known message', function () {
        var result = request.intentRequest({ name: 'AppIntent', slots: { SlotName: {} } });
        return result.should.eventually.equal('<speak>' + Text.defaultResponse + '</speak>');
    });
});

describe('an unknown intent', function () {
    it('should respond with an error message', function () {
        var result = request.intentRequest({ name: '', slots: {} });
        return result.should.eventually.equal('<speak>Sorry, the application didn\'t know what to do with that intent</speak>');
    });
});

describe('the help intent', function () {
    it('should respond with the help message', function () {
        var result = request.intentRequest({ name: 'AMAZON.HelpIntent' });
        return result.should.eventually.equal('<speak>' + Text.helpText + '</speak>');
    });
});

describe('the cancel intent', function () {
    it('should respond with the goodbye message', function () {
        var result = request.intentRequest({ name: 'AMAZON.CancelIntent' });
        return result.should.eventually.equal('<speak>' + Text.goodbye + '</speak>');
    });
});
