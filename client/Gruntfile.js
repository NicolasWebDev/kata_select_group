'use strict';

var serve_static = require('serve-static');

var mountFolder = function (connect, dir) {
  return serve_static(require('path').resolve(dir));
};


module.exports = function (grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var yeomanConfig = { app: 'app' };

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {}

  grunt.initConfig({
    babel: {
      options: {
        sourceMap: true,
        presets: ['env']
      },
      dist: {
        files: {
          'app/scripts/group/controller.js':
            'app/scripts/group/controller.es6.js',
          'app/scripts/group/specs/controller_spec.js':
            'app/scripts/group/specs/controller_spec.es6.js'
        }
      }
    },
    yeoman: yeomanConfig,
    watch: {
      recess: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.less'],
        tasks: ['recess:dist']
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '../.jshintrc',
        ignores: ['<%= yeoman.app %>/scripts/**/specs/fixtures/**.js']
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,**/}**.js'
      ]
    },

    concurrent: {
      test: [
        //'recess'
      ],
    },
    karma: {
      dev: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.registerTask('test', [
    'clean:server',
    'babel',
    'concurrent:test',
    'connect:test',
    'karma:dev'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'babel',
    'test'
  ]);
};
