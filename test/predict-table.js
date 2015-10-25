define(function (require) {
	var PredictTable = require('cjs!../dist/predict-table')

	QUnit.module('PredictTable')

	QUnit.test('getPredict/setPredict', function (assert) {
		var pt = new PredictTable
		assert.equal(pt.getPredict('A', 'a'), null)

		pt.setPredict('A', 'a', 1)
		assert.equal(pt.getPredict('A', 'a'), 1)
	})
})