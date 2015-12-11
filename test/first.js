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
				0     : ['a'],
				result: ['a']
			}
		})
	})

	QUnit.test('simple case2', function (assert) {
		var pc = new ProductionCollection
		pc.add(new Production('A', ['a', 'b', 'B']))
		pc.add(new Production('B', ['b', 'c']))
		assert.deepEqual(first(pc), {
			A: {
				0     : ['a'],
				result: ['a']
			},
			B: {
				0     : ['b'],
				result: ['b']
			}
		})
	})

	QUnit.test('simple case3', function (assert) {
		var pc = new ProductionCollection
		pc.add(new Production('A', ['a', 'b']))
		pc.add(new Production('A', ['b', 'c']))
		assert.deepEqual(first(pc), {
			A: {
				0     : ['a'],
				1     : ['b'],
				result: ['a', 'b']
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
				0     : ['c'],
				result: ['c']
			},
			A: {
				0     : ['a'],
				1     : ['a'],
				result: ['a']
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
				0     : ['id'],
				result: ['id']
			},
			T: {
				0     : ['id'],
				result: ['id']
			},
			F: {
				0     : ['+'],
				1     : [Production.EMPTY],
				result: ['+', Production.EMPTY]
			}
		})
	})


	QUnit.test('sample2', function (assert) {
		var pc = pcStore.sample2()
		assert.deepEqual(pc.getNonTerminals(), ['E', 'EE', 'T', 'TT', 'F'])
		assert.deepEqual(first(pc), {
			E : {
				0     : ['(', 'id'],
				result: ['(', 'id']
			},
			EE: {
				0     : ['+'],
				1     : [Production.EMPTY],
				result: ['+', Production.EMPTY]
			},
			T : {
				0     : ['(', 'id'],
				result: ['(', 'id']
			},
			TT: {
				0     : ['*'],
				1     : [Production.EMPTY],
				result: ['*', Production.EMPTY]
			},
			F : {
				0     : ['('],
				1     : ['id'],
				result: ['(', 'id']
			}
		})
	})

})