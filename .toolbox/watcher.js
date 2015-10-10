module.exports = {
	version         : '0.0.0',
	filePathExcludes: [
		/^bower_components/,
		/^\.idea/,
		/^\.git/,
	],
	tasks           : [{
		isEnabled    : true,
		description  : 'compile es6 to es5',
		fileNameMatch: /\.es6\.js$/,
		program      : 'babel',
		arguments    : [
			'$FilePath',
			'--out-file ${DirPath}/${FileNameWithoutAllExtensions}.js'
		]
	}]
}
