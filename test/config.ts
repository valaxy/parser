requirejs.config({
	baseUrl: '../',
	paths  : {
		'underscore'              : 'node_modules/underscore/underscore',
		'cjs'                     : 'node_modules/cjs/cjs',
		'amd-loader'              : 'node_modules/amd-loader/amd-loader',
		'algorithm-data-structure': 'node_modules/algorithm-data-structure/'
	},
	cjs    : [
		'algorithm-data-structure'
	]
})