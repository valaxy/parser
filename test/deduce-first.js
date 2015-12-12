define(function (require) {
	var deduceFirst          = require('cjs!../dist/deduce-first'),
	    ProductionCollection = require('cjs!../dist/data/production-collection'),
	    Production           = require('cjs!../dist/data/production'),
	    pcStore              = require('./pc-store')

	QUnit.module('deduceFirst()')

	QUnit.test('simple case1', function (assert) {
		var pc = new ProductionCollection([
			['A', ['a', 'b']]
		])
		assert.deepEqual(deduceFirst(pc).toJSON(), {
			A: {
				0     : ['a'],
				total : ['a'],
				length: 1
			}
		})
	})

	QUnit.test('simple case2', function (assert) {
		var pc = new ProductionCollection([
			['A', ['a', 'b', 'B']],
			['B', ['b', 'c']]
		])
		assert.deepEqual(deduceFirst(pc).toJSON(), {
			A: {
				0     : ['a'],
				total : ['a'],
				length: 1
			},
			B: {
				0     : ['b'],
				total : ['b'],
				length: 1
			}
		})
	})

	QUnit.test('simple case3', function (assert) {
		var pc = new ProductionCollection([
			['A', ['a', 'b']],
			['A', ['b', 'c']]
		])
		assert.deepEqual(deduceFirst(pc).toJSON(), {
			A: {
				0     : ['a'],
				1     : ['b'],
				total : ['a', 'b'],
				length: 2
			}
		})
	})

	QUnit.test('simple case4', function (assert) {
		var pc = new ProductionCollection([
			['S', ['c', 'A', 'd']],
			['A', ['a', 'b']],
			['A', ['a']]
		])
		assert.deepEqual(deduceFirst(pc).toJSON(), {
			S: {
				0     : ['c'],
				total : ['c'],
				length: 1
			},
			A: {
				0     : ['a'],
				1     : ['a'],
				total : ['a'],
				length: 2
			}
		})
	})

	QUnit.test('fail case', function (assert) {
		var pc = new ProductionCollection([
			['A', ['A', 'a']]
		])
		assert.throws(function () {
			deduceFirst(pc)
		})
	})


	QUnit.test('sample1', function (assert) {
		var pc = pcStore.sample1()
		assert.deepEqual(deduceFirst(pc).toJSON(), {
			E: {
				0     : ['id'],
				total : ['id'],
				length: 1
			},
			T: {
				0     : ['id'],
				total : ['id'],
				length: 1
			},
			F: {
				0     : ['+'],
				1     : [Production.EMPTY],
				total : ['+', Production.EMPTY],
				length: 2
			}
		})
	})


	QUnit.test('sample2', function (assert) {
		var pc = pcStore.sample2()
		assert.deepEqual(pc.getNonTerminals(), ['E', 'EE', 'T', 'TT', 'F'])
		assert.deepEqual(deduceFirst(pc).toJSON(), {
			E : {
				0     : ['(', 'id'],
				total : ['(', 'id'],
				length: 1
			},
			EE: {
				0     : ['+'],
				1     : [Production.EMPTY],
				total : ['+', Production.EMPTY],
				length: 2
			},
			T : {
				0     : ['(', 'id'],
				total : ['(', 'id'],
				length: 1
			},
			TT: {
				0     : ['*'],
				1     : [Production.EMPTY],
				total : ['*', Production.EMPTY],
				length: 2
			},
			F : {
				0     : ['('],
				1     : ['id'],
				total : ['(', 'id'],
				length: 2
			}
		})
	})

})