define(function (require) {
	require('./production')
	require('./production-collection')
	require('./first')
	require('./follow')
	require('./predict-table')

	QUnit.load()
	QUnit.start()
})