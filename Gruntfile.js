module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    'babel': {
      options: {
        sourceMap: false,
        presets: ['es2015']
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.js'],
          dest: 'lib/'
        }]
      }
    },

    sass: {
      dist: {
        files: {
          'lib/client/customStyles.css': 'src/client/customStyles.scss'
        }
      }
    },

    clean: {
      lib: ['./lib/**']
    }
  })

  grunt.registerTask('build', ['clean', 'sass', 'babel'])
}
