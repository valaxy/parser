define(function (require) {
	var follow               = require('../lib/follow'),
	    ProductionCollection = require('../lib/production-collection'),
	    Production           = require('../lib/production'),
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

	QUnit.test('complex case', function (assert) {
		var pd = new ProductionCollection
		pd.add(new Production('E', ['T', "E'"]))
		pd.add(new Production("E'", ['+', 'T', "E'"]))
		pd.add(new Production("E'", [Production.EMPTY]))
		pd.add(new Production('T', ['F', "T'"]))
		pd.add(new Production("T'", ['*', 'F', "T'"]))
		pd.add(new Production("T'", [Production.EMPTY]))
		pd.add(new Production('F', ['(', 'E', ')']))
		pd.add(new Production('F', ['id']))
		assert.deepEqual(convertFollow(follow(pd, 'E')), {
			"E" : [')', Production.END],
			"E'": [')', Production.END],
			"T" : ['+', ')', Production.END],
			"T'": ['+', ')', Production.END],
			"F" : ['+', '*', ')', Production.END]
		})
	})

	QUnit.load()
})