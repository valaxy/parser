module.exports = {
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
			'--out-file ${DirPath}/${FileNameWithoutAllExtensions}.js',
			'--source-maps true'
		],
		matchOnFileRelativePath: /\.es6\.js$/
	}]
}
