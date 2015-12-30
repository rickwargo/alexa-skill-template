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

var gulp = require('gulp-help')(require('gulp')),
    gutil = require('gulp-util'),
    jslint = require('gulp-jslint'),
    del = require('del'),
    install = require('gulp-install'),
    zip = require('gulp-zip'),
    runSequence = require('run-sequence'),
    awsLambda = require('node-aws-lambda'),
    AWS = require('aws-sdk'),
    Config = require('./config/lambda-config'),
    fs = require('fs'),
    shell = require('gulp-shell');

AWS.config.update({region:  Config.region});

var filePaths = {
    lintFiles:      ['index.js', 'gulpfile.js', './lib/**/*.js', './config/**/*.js', './test/**/*.js', './bin/**/*.js'],
    unitTestFiles:  ['**/*.js', 'test/**/*']
};

/*jslint nomen: true*/
function stringAsSrc(filename, string) {
    var src = require('stream').Readable({ objectMode: true });
    src._read = function () {
        this.push(new gutil.File({ cwd: '', base: '', path: filename, contents: new Buffer(string) }));
        this.push(null);
    };
    return src;
}
/*jslint nomen: false*/

gulp.task('default', ['help']);

gulp.task('lint', 'Lints all server side js', function () {
    return gulp.src(filePaths.lintFiles)
        .pipe(jslint());
});

gulp.task('test-local', 'Run unit tests against local server **',
    shell.task('SERVER=Local mocha -c'),
    {
        aliases: ['test']
    });

gulp.task('test-lambda', 'Run unit tests against AWS lambda **',
    shell.task('mocha -c'),
    {
        aliases: ['lambda']
    });

gulp.task('build-lambda-code', 'Process source and create dist.zip file to upload to AWS lambda **', function (callback) {
    return runSequence(
        'clean',
        'lint',
        'test-local',
        ['js', 'assets', 'config', 'vendor', 'node-mods'],
        ['build-intent-schema', 'build-utterances', 'build-custom-slot-types'],
        'zip',
        callback
    );
}, {
    aliases: ['build']
});

gulp.task('push-lambda-code', 'Process source then upload to AWS lambda **', function (callback) {
    return runSequence(
        'build-lambda-code',
        'upload',
        'test-lambda',
        callback
    );
}, {
    aliases: ['push']
});

gulp.task('quick-push-lambda-code', 'Process source then upload to AWS lambda without updating modules **', function (callback) {
    return runSequence(
        'lint',
        ['js', 'assets', 'config', 'vendor'],
        'zip',
        'upload',
        callback
    );
}, {
    aliases: ['quick', 'quick-push']
});

gulp.task('build-intent-schema', 'Build the intent schema from source **', function () {
    var app = require('./index.js'),
        str = app.schema();

    return stringAsSrc('IntentSchema.json', str).pipe(gulp.dest('assets/speech/'));
}, {
    aliases: ['intent', 'intents']
});

gulp.task('build-utterances', 'Build the utterances from source **', function () {
    var app = require('./index.js'),
        str = app.utterances();

    return stringAsSrc('SampleUtterances.txt', str).pipe(gulp.dest('assets/speech/'));
}, {
    aliases: ['utterances']
});

gulp.task('build-custom-slot-types', 'Build the custom slot types from source **', function () {
    var app = require('./index.js'),
        str = app.customSlotTypes();

    return stringAsSrc('CustomSlotTypes.txt', str).pipe(gulp.dest('assets/speech/'));
}, {
    aliases: ['slots']
});

gulp.task('clean', 'Clean out the dist folder and remove the compiled zip file', function () {
    return del(['./dist', './dist.zip']);
});

gulp.task('js', 'Compile/move javascript files to dist', function () {
    gulp.src('index.js').pipe(gulp.dest('dist/'));
    return gulp.src('lib/helper/*').pipe(gulp.dest('dist/lib/helper'));
});

// TODO: Make this env production/develop/test config files
gulp.task('config', 'Compile/move config files to dist', function () {
    return gulp.src('config/*').pipe(gulp.dest('dist/config'));
});

gulp.task('vendor', 'Compile/move vendor files to dist', function () {
    gulp.src('vendor/alexa-app/*').pipe(gulp.dest('dist/vendor/alexa-app'));
    return gulp.src('vendor/alexa-utterances/*').pipe(gulp.dest('dist/vendor/alexa-utterances'));
});

gulp.task('assets', 'Compile/move assets files to dist', function () {
    gulp.src('assets/*').pipe(gulp.dest('dist/assets'));
    return gulp.src('images/*').pipe(gulp.dest('dist/images'));
});

gulp.task('node-mods', 'Install npm packages to dist, ignoring devDependencies', function () {
    return gulp.src('./package.json')
        .pipe(gulp.dest('./dist/'))
        .pipe(install({production: true}));
});

gulp.task('zip', 'Zip the dist directory', function () {
    return gulp.src(['dist/**/*', '!package.json'])
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('upload', 'Upload zip file to lambda', function (callback) {
    return awsLambda.deploy('./dist.zip', Config, callback);
});

gulp.task('watch-test', 'Watch for changed files and run unit tests when a file changes', function () {
    return gulp.watch(filePaths.unitTestFiles, ['test-local']);
});

gulp.task('watch-lint', 'Watch for changed files and run lint of the file that has changed', function () {
    gulp.watch(filePaths.lintFiles).on('change', function (file) {
        gulp.src(file.path)
            .pipe(jslint())
            .on('error', function (err) { console.log(err); });   // jslint spits out errors
    });
});

gulp.task('watch', ['watch-lint', 'watch-test']);
