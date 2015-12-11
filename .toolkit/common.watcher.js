module.exports = {
	matchOnFileRelativePath: [
		'lib',
		'lib/**/*'
	],
	tasks                  : [{
		isEnabled              : true,
		name                   : 'es6',
		description            : 'compile es6 to es5',
		program                : 'babel',
		arguments              : [
			'$filePath',
			'--out-file ${projectPath}/dist/${fileNameWithoutAllExtensions}.js',
			'--source-maps true'
		],
		matchOnFileRelativePath: '**/*.es6.js'
	}]
}
