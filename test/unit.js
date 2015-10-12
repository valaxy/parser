define(function (require) {
	require('./production')
	require('./production-collection')
	require('./first')
	require('./follow')

	QUnit.load()
	QUnit.start()
})