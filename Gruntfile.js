module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-ember-template-compiler');

  var editorFiles = [
    "frontend/vendor/showdown.js",
    "frontend/vendor/handlebars.js",
    "frontend/vendor/moment.js",
    "frontend/vendor/ember.js",
    "frontend/vendor/ember-data.js",
    "frontend/vendor/django-rest-framework-serializer.js",
    "frontend/vendor/django-rest-framework-adapter.js",
    "frontend/lib/csrf.js",
    "frontend/lib/application.js",
    "frontend/lib/templates.js"
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: [
          'frontend/lib/**/*.js',
          'frontend/templates/**/*.handlebars'
        ],
        tasks: ['dev'],
        options: {
          interrupt: true,
          debounceDelay: 250
        }
      },
      less: {
        files: [
          'frontend/less/**/*.less'
        ],
        tasks: ['less'],
        options: {
          interrupt: true,
          debounceDelay: 250
        }
      }
    },
    emberhandlebars: {
      compile: {
        options: {
          templateName: function(sourceFile) {
            var newSource = sourceFile.replace('frontend/templates/', '');
            return newSource.replace('.handlebars', '');
          }
        },
        files: ['frontend/templates/**/*.handlebars'],
        dest: 'frontend/lib/templates.js'
      }
    },
    concat: {
      dist: {
        src: editorFiles,
        dest: 'simple_publishing/static/publishing/js/editor.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n',
        sourceMap: function(dest) { return dest + '.map'; },
        sourceMappingURL: function(dest) { return dest.replace(/^.*static/, '/static') + '.map'; },
        sourceMapPrefix: 1,
        sourceMapRoot: '/'
      },
      dist: {
        src: editorFiles,
        dest: 'simple_publishing/static/publishing/js/editor.min.js'
      }
    },
    less: {
      dist: {
        options: {
          compress: true
        },
        files: {
          "simple_publishing/static/publishing/css/publishing.css": "frontend/less/bootstrap.less"
        }
      }
    }
  });

  grunt.task.registerTask('dev', ['emberhandlebars', 'concat']);
  grunt.task.registerTask('local', ['dev', 'less', 'watch']);
  grunt.task.registerTask('build', ['emberhandlebars', 'concat', 'uglify', 'less']);
}
