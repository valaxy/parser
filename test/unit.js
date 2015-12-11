define(function (require) {
	require('./production')
	require('./production-collection')
	require('./first')
	require('./follow')
	require('./predict-table')
	require('./predict')

	QUnit.load()
	QUnit.start()
})