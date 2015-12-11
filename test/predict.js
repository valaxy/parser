define(function (require) {
	var pcStore = require('./pc-store'),
	    predict = require('cjs!../dist/predict')


	QUnit.module('predict')

	QUnit.test('sample 1', function (assert) {
		var pc = pcStore.sample1()
		var pt = predict(pc, 'E')
		assert.deepEqual(pt.toJSON(), {
			E: {'id': pc.getProductionsBySymbol('E')[0]},
			T: {'id': pc.getProductionsBySymbol('T')[0]},
			F: {'+': pc.getProductionsBySymbol('F')[0], '1': pc.getProductionsBySymbol('F')[1]}
		})
	})
})