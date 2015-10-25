module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt)

	//grunt.file.setBase('../')

	grunt.initConfig({
		babel: {
			options: {
				sourceMap: true
			},
			default: {
				src : 'lib/first.es6.js',
				dest: 'dist/first.js'
			}
		},

		watch: {
			options: {
				spawn: false
			},
			babel  : {
				files: ['lib/**/*.es6.js'],
				tasks: ['babel']
			}
		}
	})


	grunt.event.on('watch', function (action, filePath) {
		grunt.config('babel.default.src', filePath)
		grunt.config('babel.default.dest', 'dist/' + filePath.slice(4, filePath.length - 7) + '.js')
	})

	grunt.registerTask('default', [
		'watch'
	])
}


