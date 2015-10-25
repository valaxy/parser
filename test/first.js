define(function (require) {
	var first                = require('cjs!../dist/first'),
	    ProductionCollection = require('cjs!../dist/production-collection'),
	    Production           = require('cjs!../dist/production')


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

	QUnit.test('complex case', function (assert) {
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

		assert.deepEqual(pd.getNonTerminals(), ['E', "E'", 'T', "T'", 'F'])
		assert.deepEqual(first(pd), {
			"E" : ['(', 'id'],
			"E'": ['+', Production.EMPTY],
			"T" : ['(', 'id'],
			"T'": ['*', Production.EMPTY],
			"F" : ['(', 'id']
		})
	})

	QUnit.test('fail case', function (assert) {
		var pd = new ProductionCollection
		pd.add(new Production('A', ['A', 'a']))
		assert.equal(first(pd), null)

	})
})