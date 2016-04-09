define(function (require) {
	var pcStore = require('./pc-store'),
	    predict = require('cjs!../lib/deduce-predict')

	QUnit.module('deducePredict()')

	QUnit.test('sample1', function (assert) {
		var pc = pcStore.sample1()
		var pt = predict(pc, 'E')
		assert.deepEqual(pt.toJSON(), {
			E: {'id': pc.getProductionAt(0)},
			T: {'id': pc.getProductionAt(1)},
			F: {'+': pc.getProductionAt(2), '1': pc.getProductionAt(3)}
		})
	})

	QUnit.test('sample2', function (assert) {
		var pc = pcStore.sample2()
		var pt = predict(pc, 'E')
		assert.deepEqual(pt.toJSON(), {
			E : {
				'id': pc.getProductionAt(0),
				'(' : pc.getProductionAt(0)
			},
			EE: {
				'+': pc.getProductionAt(1),
				')': pc.getProductionAt(2),
				'1': pc.getProductionAt(2)
			},
			T : {
				'id': pc.getProductionAt(3),
				'(' : pc.getProductionAt(3)
			},
			TT: {
				'+': pc.getProductionAt(5),
				'*': pc.getProductionAt(4),
				')': pc.getProductionAt(5),
				'1': pc.getProductionAt(5)
			},
			F : {
				'id': pc.getProductionAt(7),
				'(' : pc.getProductionAt(6)
			}
		})
	})


})