define(function (require) {
	var deduceFollow         = require('cjs!../dist/deduce-follow'),
	    ProductionCollection = require('cjs!../dist/data/production-collection'),
	    Production           = require('cjs!../dist/data/production'),
	    pcStore              = require('./pc-store'),
	    Follow               = require('cjs!../dist/data/follow')

	QUnit.module('deduceFollow()')

	QUnit.test('_recordState()', function (assert) {
		var follow = {
			_follows: {
				A: new Set(['a', 'b']),
				B: new Set(['a']),
				C: new Set(['c', '1', '2']),
				D: new Set([])
			}
		}
		var state = deduceFollow._recordState(follow)
		assert.deepEqual(state, [2, 1, 3, 0])
	})

	QUnit.test('case1', function (assert) {
		var pc = new ProductionCollection
		pc.add(new Production('A'))
		assert.deepEqual(deduceFollow(pc, 'A').toJSON(), {
			A: [Production.END]
		})
	})

	QUnit.test('case2', function (assert) {
		var pc = new ProductionCollection
		pc.add(new Production('A', ['a', 'b']))
		assert.deepEqual(deduceFollow(pc, 'A').toJSON(), {
			A: [Production.END]
		})
	})

	QUnit.test('case3', function (assert) {
		var pc = new ProductionCollection
		pc.add(new Production('A', ['a', 'B', 'c']))
		pc.add(new Production('B', ['x']))
		assert.deepEqual(deduceFollow(pc, 'A').toJSON(), {
			A: [Production.END],
			B: ['c']
		})
	})


	QUnit.test('case4', function (assert) {
		var pc = new ProductionCollection([
			["T", ["F", "T'"]],
			["T'", ['*', "F", "T'"]],
			["T'", [Production.EMPTY]],
			["F", ['id']]
		])
		assert.deepEqual(deduceFollow(pc, 'T').toJSON(), {
			"T" : [Production.END],
			"T'": [Production.END],
			"F" : ['*', Production.END]
		})
	})


	QUnit.test('case5', function (assert) {
		var pc = new ProductionCollection([
			['E', ['T', "E'"]],
			["E'", ['+', 'T', "E'"]],
			["E'", [Production.EMPTY]],
			['T', ['F', "T'"]],
			["T'", ['*', 'F', "T'"]],
			["T'", [Production.EMPTY]],
			['F', ['(', 'E', ')']],
			['F', ['id']]
		])
		assert.deepEqual(deduceFollow(pc, 'E').toJSON(), {
			"E" : [')', Production.END],
			"E'": [')', Production.END],
			"T" : [')', '+', Production.END],
			"T'": [')', '+', Production.END],
			"F" : [')', '*', '+', Production.END]
		})
	})


	QUnit.test('case6', function (assert) {
		var pc = new ProductionCollection([
			['A', ['D', Production.EMPTY]],
			['B', ['a']],
			['C', ['A', 'B']],
			['D', ['d']]
		])
		assert.deepEqual(deduceFollow(pc, 'C').toJSON(), {
			A: ['a'],
			B: [Production.END],
			C: [Production.END],
			D: ['a']
		})
	})


	QUnit.test('sample1', function (assert) {
		var pc = pcStore.sample1()
		assert.deepEqual(deduceFollow(pc, 'E').toJSON(), {
			E: [Production.END],
			T: ['+', Production.END],
			F: [Production.END]
		})
	})
})