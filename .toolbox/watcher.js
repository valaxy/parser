module.exports = {
	version                   : '0.0.0',
	excludesOnFileRelativePath: [
		/^bower_components/,
		/^\.idea/,
		/^\.git/,
	],
	tasks                     : [{
		isEnabled              : true,
		description            : 'compile es6 to es5',
		program                : 'babel',
		arguments              : [
			'$FilePath',
			'--out-file ${DirPath}/${FileNameWithoutAllExtensions}.js'
		],
		matchOnfileRelativePath: /\.es6\.js$/
	}]
}
