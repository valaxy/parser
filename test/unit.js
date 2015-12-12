define(function (require) {
	require('./data/production')
	require('./data/production-collection')
	require('./data/first')
	require('./data/predict')

	require('./deduce-first')
	require('./deduce-follow')
	require('./deduce-predict')
	require('./ll')

	QUnit.load()
	QUnit.start()
})