/*
  
  GruntJS task runner for Stratio UI Kit Styleguide

  author: Alejandro Rodriguez (alejandrorodriguez@stratio.com)
  version: 0.1


  Tasks

  grunt doc.......................Generates the documentation of the styleguide
  grunt serve.....................Launch a local webserver in http://localhost:9001
                                  to show the documentation
  grunt default...................Launch the doc task


  Plugins

  time-grunt......................Measure the time used in each subtask
  grunt-contrib-sass..............Sass compiler
  grunt-contrib-watch.............Watcher to automatize tasks if files changed
  grunt-batch.....................Execute bat files
  grunt-contrib-clean.............Clean files and directories
  grunt-contrib-copy..............Copy files and directories
  grunt-contrib-connect...........Creates a local webserver


*/

'use strict';

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  /*

    Configurable paths for the application

    Note that the bat command needs to be typed exactly as it will be executed, so
    it doesn't support the use of vars inside the command. Then, keep in mind that
    if you change the paths, you should check the bat command to ensure that all 
    will be executed as expected. Check in the "batch" subtask.

  */
  var appConfig = {
    src: 'src',               // Folder of the source
    dist: 'dist',             // Folder of the distributable deliverables.
    styleguide: 'styleguide', // Warning: This name is used to reference files 
                              // and folders.
    vendors: 'vendors',       // Folder of the vendors not included in npm or bower
    egeoBase: 'node_modules/egeo.ui.base/dist/',        // Folder of the Egeo UI Base Framework
    assets: 'assets'
  };

  grunt.initConfig({
    // Set the paths to be available inside the grunt tasks
    app: appConfig,

    //Sass compile
    sass: {
      dist: {
        options: {
          sourcemap: 'auto',  // The sourcemaps are a way to map the compiled and
                              // minified files to let the browser to know when
                              // inspect code the original file and line we are
                              // inspecting
          style: 'compressed',// Minify the Sass as much as possible
          trace: 'true'       // Apply the option --trace to the compiler
        },
        files: {
          '<%= app.dist %>/stratio-ui.base.css': '<%= app.src %>/index.scss',
        }
      },
      styleguide: {
        options: {
          sourcemap: 'auto',  // The sourcemaps are a way to map the compiled and
                              // minified files to let the browser to know when
                              // inspect code the original file and line we are
                              // inspecting
          style: 'compressed' // Minify the Sass as much as possible
        },
        files: {
          '<%= app.dist %>/<%= app.styleguide %>/public/<%= app.styleguide %>.css': 'src/<%= app.styleguide %>.scss'
        }
      }
    },

    /* 

      Watch task to automatically refresh the documentation when any Sass file 
      changes in any subfolder.

        Warning: Sometimes it fails on Windows due to the antivirus is checking 
        the files and are blocked. So it is needed create another change in a 
        Sass file to the watch repeat the task and write the compiled 
        documentation properly.

    */
    watch: {
      sass: {
        files: ['<%= app.src %>/*.scss', '<%= app.src %>/**/*.scss'], // Files to watch
        tasks: ['doc'],                                               // Taks to execute when changes detected
        options: {
          spawn: true,  // If the spawn property is established to false, the 
                        // system is faster but also  more prone to fail due to 
                        // it opens a second thread to treat the files and can 
                        // result in the warning explained above.
        },
      },
    },

    /*

      The batch task executes a command like we were using the command line directly.
      It launches the kss-node compiler.

        NOTE: Only tested in Windows 8.1. Probably we will must adapt it to work
              under unix systems.

    */
    batch : {
      doc: {
        options: {
          cmd: function(f) {
            return '.\\node_modules\\.bin\\kss-node --source src --destination dist/styleguide --template vendors/kss-template --homepage readme.md --css public/styleguide.css';
          }
        },
        files: [{
          cwd: 'src',
          src: ['*.scss', '!_*.scss', '!<%= app.styleguide %>.scss']
        }]
      }
    },

    /* It cleans the files and folders */
    clean: {
      options: {
        force: true
      },
      dist: ['dist'],
      styleguide: ['<%= app.dist %>/<%= app.styleguide %>']
    },

    /* It copies the vendors needed to the documentation be viewed properly. */
    copy: {
      styleguide: {
        files: [
          // Includes font files within path and its sub-directories
          {expand: true, cwd: '<%= app.egeoBase %>', src: ['<%= app.assets %>/**'], dest: '<%= app.dist %>/<%= app.styleguide %>/public'},
          {expand: true, cwd: '<%= app.src %>', src: ['<%= app.assets %>/**'], dest: '<%= app.dist %>/<%= app.styleguide %>/public'}
        ],
      },
    },

    /* It launches a local webserver to view the compiled documentation. */
    connect: {
      server: {
        options: {
          port: 9001,
          base: '<%= app.dist %>/<%= app.styleguide %>',
          keepalive: true
        }
      }
    }
  });

  // Load the npm tasks needed
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-batch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');

  /*

    Define the tasks

  */
  grunt.registerTask('serve', [
    'connect'           // Launch the local webserver in http://localhost:9001 
                        // to view the documentation
  ]);

  grunt.registerTask('sass-watch', [
    'watch:sass'        // Launch the doc task every time a Sass file changes
  ]);

  grunt.registerTask('doc', [
    'clean:styleguide', // Clean the directory to ensure all files are generated 
                        // from scratch
    'batch:doc',        // Generate KSS documentation
    'copy:styleguide',  // Copy files needed
    'sass:styleguide'   // Generate custom CSS to customize the documentation
  ]);

  grunt.registerTask('default', [
    'doc'               // Generate the documentation
  ]);
};
