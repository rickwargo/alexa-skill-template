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

//TODO! This is getting used for node-aws-lambda and the Config settings. Probably need to separate/rename.
module.exports = {
    //profile: '', // optional for loading AWS credentials from custom profile
    applicationId: 'amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe',
    applicationName: 'template',
    namespace: 'TEMPLATE.',
    region: 'us-east-1',
    handler: 'index.handler',
    functionName: '',
    timeout: 3,
    memorySize: 128,
    runtime: 'nodejs' // default: 'nodejs'
};

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;
