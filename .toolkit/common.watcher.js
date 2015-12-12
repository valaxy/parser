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
			'$filePath'
		],
		createOutputFromStdout : true,
		outputPath             : function (info) {
			return info.projectPath + '/dist/' + info.dirRelativePath.substr('lib/'.length) + '/' + info.fileNameWithoutAllExtensions + '.js'
		},
		matchOnFileRelativePath: '**/*.es6'
	}]
}
