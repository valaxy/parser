define(function (require) {
	var first                = require('cjs!../dist/first'),
	    ProductionCollection = require('cjs!../dist/production-collection'),
	    Production           = require('cjs!../dist/production'),
	    pcStore              = require('./pc-store')

	QUnit.module('first')

	QUnit.test('simple case1', function (assert) {
		var pc = new ProductionCollection
		pc.add(new Production('A', ['a', 'b']))
		assert.deepEqual(first(pc), {
			A: {
				0    : ['a'],
				total: ['a']
			}
		})
	})

	QUnit.test('simple case2', function (assert) {
		var pc = new ProductionCollection
		pc.add(new Production('A', ['a', 'b', 'B']))
		pc.add(new Production('B', ['b', 'c']))
		assert.deepEqual(first(pc), {
			A: {
				0    : ['a'],
				total: ['a']
			},
			B: {
				0    : ['b'],
				total: ['b']
			}
		})
	})

	QUnit.test('simple case3', function (assert) {
		var pc = new ProductionCollection
		pc.add(new Production('A', ['a', 'b']))
		pc.add(new Production('A', ['b', 'c']))
		assert.deepEqual(first(pc), {
			A: {
				0    : ['a'],
				1    : ['b'],
				total: ['a', 'b']
			}
		})
	})

	QUnit.test('simple case4', function (assert) {
		var pc = new ProductionCollection
		pc.add(new Production('S', ['c', 'A', 'd']))
		pc.add(new Production('A', ['a', 'b']))
		pc.add(new Production('A', ['a']))
		assert.deepEqual(first(pc), {
			S: {
				0    : ['c'],
				total: ['c']
			},
			A: {
				0    : ['a'],
				1    : ['a'],
				total: ['a']
			}
		})
	})

	QUnit.test('fail case', function (assert) {
		var pc = new ProductionCollection
		pc.add(new Production('A', ['A', 'a']))
		assert.throws(function () {
			first(pc)
		})
	})


	QUnit.test('sample1', function (assert) {
		var pc = pcStore.sample1()
		assert.deepEqual(first(pc), {
			E: {
				0    : ['id'],
				total: ['id']
			},
			T: {
				0    : ['id'],
				total: ['id']
			},
			F: {
				0    : ['+'],
				1    : [Production.EMPTY],
				total: ['+', Production.EMPTY]
			}
		})
	})


	QUnit.test('sample2', function (assert) {
		var pc = pcStore.sample2()
		assert.deepEqual(pc.getNonTerminals(), ['E', 'EE', 'T', 'TT', 'F'])
		assert.deepEqual(first(pc), {
			E : {
				0    : ['(', 'id'],
				total: ['(', 'id']
			},
			EE: {
				0    : ['+'],
				1    : [Production.EMPTY],
				total: ['+', Production.EMPTY]
			},
			T : {
				0    : ['(', 'id'],
				total: ['(', 'id']
			},
			TT: {
				0    : ['*'],
				1    : [Production.EMPTY],
				total: ['*', Production.EMPTY]
			},
			F : {
				0    : ['('],
				1    : ['id'],
				total: ['(', 'id']
			}
		})
	})

})