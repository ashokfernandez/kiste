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

    clean: {
      lib: ['./lib/**']
    }
  })

  grunt.registerTask('build', ['clean', 'babel'])
}
