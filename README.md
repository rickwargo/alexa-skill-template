# Template for Alexa Development
An [AWS Lambda](http://aws.amazon.com/lambda) template for building Alexa Skills. 
This template provides the shell that can be used to set up a working Alexa Skill on AWS and the Amazon Echo.

Additionally, the template supports the following development practices through gulp:

| Available tasks         | Description                                                      |
| ----------------------- | ---------------------------------------------------------------- |
| assets                  | Compile/move assets files to dist                                |
| build-custom-slot-types | Build the custom slot types from source ** Aliases: slots        |
| build-intent-schema     | Build the intent schema from source ** Aliases: intent, intents  |
| build-lambda-code       | Process source and create dist.zip file to upload to AWS lambda ** Aliases: build|
| build-utterances        | Build the utterances from source ** Aliases: utterances          |
| clean                   | Clean out the dist folder and remove the compiled zip file       |
| config                  | Compile/move config files to dist                                |
| default                 | [help]                                                           |
| help                    | Display this help text.                                          |
| js                      | Compile/move javascript files to dist                            |
| lint                    | Lints all server side js                                         |
| node-mods               | Install npm packages to dist, ignoring devDependencies           |
| push-lambda-code        | Process source then upload to AWS lambda ** Aliases: push        |
| quick-push-lambda-code  | Process source then upload to AWS lambda without updating modules ** Aliases: quick, quick-push|
| test-lambda             | Run unit tests against AWS lambda ** Aliases: lambda             |
| test-local              | Run unit tests against local server ** Aliases: test             |
| upload                  | Upload zip file to lambda                                        |
| vendor                  | Compile/move vendor files to dist                                |
| watch                   | [watch-lint, watch-test]                                         |
| watch-lint              | Watch for changed files and run lint of the file that has changed|
| watch-test              | Watch for changed files and run unit tests when a file changes   |
| zip                     | Zip the dist directory                                           |

## Setup
This skill will run locally to support development and testing. When ready to push the code to AWS Lambda to test as an
actual Alexa skill, AWS Lambda needs to be configured and code pushed to it, and then the Alexa Skill needs to be set up.
Prior to the following steps, you will need to set up an 
[AWS Developer account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html) and get set up on the 
[AWS Free Tier](https://aws.amazon.com/free/) to enable development, testing, and hosting for free for 12 months.

After successful sign-up of an AWS account, perform the following setups.

### AWS Template Installation
1. Copy from Template using `git://github.com/rickwargo/template.git`.
2. Remove node_modules and npm install in dest directory
3. gulp lint
4. gulp test (may need to test this)
5. edit config
6. node bin/createActivityLog.js (if using)
7. develop app
8. gulp build

### AWS Lambda Setup
1. Go to the [AWS Console](https://console.aws.amazon.com/console/home) and click on the [Lambda](https://console.aws.amazon.com/lambda/home) link. Note: ensure you are in `us-east` or you won't be able to use Alexa with Lambda.
2. Click on the [Create a Lambda Function](https://console.aws.amazon.com/lambda/home?region=us-east-1#create) or `Get Started Now` button.
3. The first step is to `Select blueprint`. Click on the `Skip` button to move on as we will start with an empty blueprint.
4. Name the Lambda Function with a name significant to your skill. This name will later be recorded in the config-lambda.js file.
5. Optionally add a description for the lambda function.
5. Select the runtime as `Node.js`.
6. In the root template directory, execute `gulp build-lambda-code`. This will lint the code, perform local unit tests, download node modules necessary for skill execution, build the intent schema, sample utterances, and custom slot types, and finally move all files to a dist directory and create a zip of those files named `dist.zip`.
7. Select Code entry type as `Upload a .ZIP file` and then upload the .zip file to AWS Lambda.
8. Keep the Handler as `index.handler`. This is defined in the alexa-app vendor module in index.js.
9. Select `lambda_dynamo` as the Role, if using DynamoDB in your skill. Otherwise select `lambda_basic_execution` for Role.
10. Leave the Advanced settings as the defaults. Depending on execution time for your function, you may want to revisit the timeout setting.
11. Click `Next` and review the settings then click `Create Function`.
12. Click the `Event Sources` tab and select `Add event source`.
13. Set the Event Source type as `Alexa Skills Kit` and Enable it now. Click `Submit`.
14. Copy the ARN from the top right to be used later in the Alexa Skill Setup. It will look something similar to `arn:aws:lambda:us-east-1:100000012345:function:My-Awesome-Alexa-Skill`.

### Alexa Skill Setup
1. Go to the [Alexa Console](https://developer.amazon.com/edw/home.html) and click `Get Started` under Alexa Skills Kit and then click the `Add a New Skill` button in the top right.
2. Set the `name` of the new skill name and an appropriate `invocation name` - this is what is used to activate your skill.
3. Optionally, set the version number of the skill, I recommend a 3-part version such as 1.0.0.
4. Select `Lambda ARN (Amazon Resource Name)` for the `Endpoint` and paste the ARN copied from the above step. Click `Next`.
5. Copy the Intent Schema from `assets/speech/IntentSchema.json`. This file was created from source during the gulp build step above.
5. Create the Custom Slot Types (if any) using the information from `assets/speech/CustomSlotTypes.txt`. This file was created from source during the gulp build step above.
6. Copy the Sample Utterances from `assets/speech/SampleUtterances.txt`. This file was created from source during the gulp build step above. Click `Next`.

### Source Setup
1. Go back to the `Skill Information` tab and copy the `Application Id`. Paste the `Application Id` into `package.json` and `config/lambda-config.js`.
2. Add the AWS Function Name to `config/lambda-config.js`.
3. If the timeout is changed from the default of 3, adjust the setting in config/lambda-config.js
4. Fill out the `Description` tab. You can use icons in images folder as a start but copy with your own icons.

### Prepare for Testing on Echo
1. Update the lambda source zip file with this change by using `gulp build` and upload to lambda again. You can also use `gulp push-lambda-code` to build the zip file and upload it to AWS Lambda. This assumes your information has been stored in the environment or in the `~/.aws/credentials` file.
3. You are now able to start testing your sample skill on the Amazon Echo! You should be able to go to the [Echo webpage](http://echo.amazon.com/#skills) and see your skill enabled.
3. In order to test it, try to say some of the Sample Utterances you created.
4. Your skill is now saved and once you are finished testing you can continue to publish your skill. Make sure to pay close attention to the information in [Submitting an Alexa Skill for Certification](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/publishing-an-alexa-skill), especially the [Submission Checklist](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-submission-checklist). 
5. At some point prior to Submitting for Certification, you will need to complete the information on the `Publishing Information` tab. This can be done now and saved.
