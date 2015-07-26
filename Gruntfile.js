module.exports = function (grunt) {

    "use strict";

    // requirements
    var argv = require('yargs').argv;

    // custom options
    var BUILD_CONFIG = {
        src_dir: './src/',
        dist_dir: './dist/'
    };

    // legacy tasks
    require('load-grunt-tasks')(grunt);

    // grunt options
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        less: { // compile all LESS to dist dir
            index: {
                expand: true,
                cwd: BUILD_CONFIG.src_dir,
                src: ['**/*.less'],
                dest: BUILD_CONFIG.dist_dir,
                ext: '.css'
            }
        },
        browserify: {
            index: {
                src: BUILD_CONFIG.src_dir + "js/index.js",
                dest: BUILD_CONFIG.dist_dir + "js/index.js",
                options: {
                    debug: true,
                    transform: ['babelify'],
                    watch: true
                }
            }
        },
        copy: {
            index: {
                files: [{
                    expand: true,
                    cwd: BUILD_CONFIG.src_dir,
                    src: ['**/*', '!**/*.less', '!**/*.js'],
                    dest: BUILD_CONFIG.dist_dir
                }]
            }
        },
        watch: { // watching all newer compilable files
            less: {
                files: BUILD_CONFIG.src_dir + "**/*.less",
                tasks: ['less'],
                options: {
                    livereload: false
                }
            },
            browserify: {
                files: BUILD_CONFIG.src_dir + "js/index.js",
                // no tasks, watchify gotcha, only for livereload
                options: {
                    debug: true,
                    livereload: true
                }
            },
            other: {
                files: ['**/*', '!**/*.less', '!**/*.js'].map(function(glob) {
                    return BUILD_CONFIG.src_dir + glob;
                }),
                tasks: ['copy'],
                options: {
                livereload: true
                }
            }
        },
        'http-server': {
            'dev': {
                root: BUILD_CONFIG.dist_dir,
                port: 3000,
                runInBackground: true,
                ext: "html"
            }
        }
    });

    var buildTasks = ["less", "browserify", "copy"];
    var watchTasks = ["http-server", "watch"];

    grunt.registerTask('build', buildTasks);
    grunt.registerTask('serve', watchTasks);
    grunt.registerTask('dev', buildTasks.concat(watchTasks))

    grunt.registerTask("default", ["dev"]);
};

