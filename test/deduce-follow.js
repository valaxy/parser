define(function (require) {
	var follow               = require('cjs!../dist/deduce-follow'),
	    ProductionCollection = require('cjs!../dist/data/production-collection'),
	    Production           = require('cjs!../dist/data/production'),
	    pcStore              = require('./pc-store')

	var convertFollow = follow._followToJSON

	QUnit.module('deduceFollow()')

	QUnit.test('_initFollow()', function (assert) {
		var pd = new ProductionCollection
		pd.add(new Production('A'))
		pd.add(new Production('B', ['A']))
		assert.deepEqual(convertFollow(follow._initFollow(pd, 'B')), {
			A: [],
			B: [Production.END]
		})
	})

	QUnit.test('_recordState()', function (assert) {
		var state = follow._recordState({
			A: new Set(['a', 'b']),
			B: new Set(['a']),
			C: new Set(['c', '1', '2']),
			D: new Set([])
		})
		assert.deepEqual(state, [2, 1, 3, 0])
	})

	QUnit.test('simple case1', function (assert) {
		var pc = new ProductionCollection
		pc.add(new Production('A'))
		assert.deepEqual(convertFollow(follow(pc, 'A')), {
			A: [Production.END]
		})
	})

	QUnit.test('simple case2', function (assert) {
		var pc = new ProductionCollection
		pc.add(new Production('A', ['a', 'b']))
		assert.deepEqual(convertFollow(follow(pc, 'A')), {
			A: [Production.END]
		})
	})

	QUnit.test('simple case3', function (assert) {
		var pc = new ProductionCollection
		pc.add(new Production('A', ['a', 'B', 'c']))
		pc.add(new Production('B', ['x']))
		assert.deepEqual(convertFollow(follow(pc, 'A')), {
			A: [Production.END],
			B: ['c']
		})
	})


	QUnit.test('complex case1', function (assert) {
		var pc = new ProductionCollection([
			["T", ["F", "T'"]],
			["T'", ['*', "F", "T'"]],
			["T'", [Production.EMPTY]],
			["F", ['id']]
		])
		assert.deepEqual(convertFollow(follow(pc, 'T')), {
			"T" : [Production.END],
			"T'": [Production.END],
			"F" : ['*', Production.END]
		})
	})


	QUnit.test('complex case2', function (assert) {
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
		assert.deepEqual(convertFollow(follow(pc, 'E')), {
			"E" : [')', Production.END],
			"E'": [')', Production.END],
			"T" : [')', '+', Production.END],
			"T'": [')', '+', Production.END],
			"F" : [')', '*', '+', Production.END]
		})
	})


	QUnit.test('sample1', function (assert) {
		var pc = pcStore.sample1()
		assert.deepEqual(convertFollow(follow(pc, 'E')), {
			E: [Production.END],
			T: ['+', Production.END],
			F: [Production.END]
		})
	})
})