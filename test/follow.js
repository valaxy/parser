define(function (require) {
	var follow               = require('cjs!../dist/follow'),
	    ProductionCollection = require('cjs!../dist/production-collection'),
	    Production           = require('cjs!../dist/production'),
	    _                    = require('underscore')

	var convertFollow = follow._followToJSON

	QUnit.module('follow')

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
		var pd = new ProductionCollection
		pd.add(new Production('A'))
		assert.deepEqual(convertFollow(follow(pd, 'A')), {
			A: [Production.END]
		})
	})

	QUnit.test('simple case2', function (assert) {
		var pd = new ProductionCollection
		pd.add(new Production('A', ['a', 'b']))
		assert.deepEqual(convertFollow(follow(pd, 'A')), {
			A: [Production.END]
		})
	})

	QUnit.test('simple case3', function (assert) {
		var pd = new ProductionCollection
		pd.add(new Production('A', ['a', 'B', 'c']))
		pd.add(new Production('B', ['x']))
		assert.deepEqual(convertFollow(follow(pd, 'A')), {
			A: [Production.END],
			B: ['c']
		})
	})


	QUnit.test('complex case1', function (assert) {
		var pd = new ProductionCollection([
			["T", ["F", "T'"]],
			["T'", ['*', "F", "T'"]],
			["T'", [Production.EMPTY]],
			["F", ['id']]
		])
		assert.deepEqual(convertFollow(follow(pd, 'T')), {
			"T" : [Production.END],
			"T'": [Production.END],
			"F" : ['*', Production.END]
		})
	})

	QUnit.test('complex case2', function (assert) {
		var pd = new ProductionCollection([
			['E', ['T', "E'"]],
			["E'", ['+', 'T', "E'"]],
			["E'", [Production.EMPTY]],
			['T', ['F', "T'"]],
			["T'", ['*', 'F', "T'"]],
			["T'", [Production.EMPTY]],
			['F', ['(', 'E', ')']],
			['F', ['id']]
		])
		assert.deepEqual(convertFollow(follow(pd, 'E')), {
			"E" : [')', Production.END],
			"E'": [')', Production.END],
			"T" : [')', '+', Production.END],
			"T'": [')', '+', Production.END],
			"F" : [')', '*', '+', Production.END]
		})
	})

	QUnit.load()
})