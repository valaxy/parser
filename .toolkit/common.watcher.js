module.exports = {
	matchOnFileRelativePath: [
		/^lib/
	],
	tasks                  : [{
		isEnabled              : true,
		name                   : 'es6',
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
