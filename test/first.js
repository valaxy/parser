define(function (require) {
	var first                = require('../lib/first'),
	    ProductionCollection = require('../lib/production-collection'),
	    Production           = require('../lib/production')


	QUnit.module('first')


	QUnit.test('simple case1', function (assert) {
		var pd = new ProductionCollection
		pd.add(new Production('A', ['a', 'b']))
		assert.deepEqual(first(pd), {
			A: ['a']
		})
	})

	QUnit.test('simple case2', function (assert) {
		var pd = new ProductionCollection
		pd.add(new Production('A', ['a', 'b', 'B']))
		pd.add(new Production('B', ['b', 'c']))
		assert.deepEqual(first(pd), {
			A: ['a'],
			B: ['b']
		})
	})

	QUnit.test('simple case3', function (assert) {
		var pd = new ProductionCollection
		pd.add(new Production('A', ['a', 'b']))
		pd.add(new Production('A', ['b', 'c']))
		assert.deepEqual(first(pd), {
			A: ['a', 'b']
		})
	})

	QUnit.test('simple case4', function (assert) {
		var pd = new ProductionCollection
		pd.add(new Production('S', ['c', 'A', 'd']))
		pd.add(new Production('A', ['a', 'b']))
		pd.add(new Production('A', ['a']))
		assert.deepEqual(first(pd), {
			S: ['c'],
			A: ['a']
		})
	})

	QUnit.test('complex case1', function (assert) {
		var pd = new ProductionCollection
		pd.add(new Production('E', ['T', "E'"]))
		pd.add(new Production("E'", ['+', 'T', "E'"]))
		pd.add(new Production("E'", [Production.EMPTY]))
		pd.add(new Production('T', ['F', "T'"]))
		pd.add(new Production("T'", ['*', 'F', "T'"]))
		pd.add(new Production("T'", [Production.EMPTY]))
		pd.add(new Production('F', ['(', 'E', ')']))
		pd.add(new Production('F', ['id']))
		assert.deepEqual(pd.getNonTerminals(), ['E', "E'", 'T', "T'", 'F'])
		assert.deepEqual(first(pd), {
			"E" : ['(', 'id'],
			"E'": ['+', Production.EMPTY],
			"T" : ['(', 'id'],
			"T'": ['*', Production.EMPTY],
			"F" : ['(', 'id']
		})
	})
})