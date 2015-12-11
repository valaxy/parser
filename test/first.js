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
			A: ['a']
		})
	})

	QUnit.test('simple case2', function (assert) {
		var pc = new ProductionCollection
		pc.add(new Production('A', ['a', 'b', 'B']))
		pc.add(new Production('B', ['b', 'c']))
		assert.deepEqual(first(pc), {
			A: ['a'],
			B: ['b']
		})
	})

	QUnit.test('simple case3', function (assert) {
		var pc = new ProductionCollection
		pc.add(new Production('A', ['a', 'b']))
		pc.add(new Production('A', ['b', 'c']))
		assert.deepEqual(first(pc), {
			A: ['a', 'b']
		})
	})

	QUnit.test('simple case4', function (assert) {
		var pc = new ProductionCollection
		pc.add(new Production('S', ['c', 'A', 'd']))
		pc.add(new Production('A', ['a', 'b']))
		pc.add(new Production('A', ['a']))
		assert.deepEqual(first(pc), {
			S: ['c'],
			A: ['a']
		})
	})

	QUnit.test('complex case', function (assert) {
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

		assert.deepEqual(pc.getNonTerminals(), ['E', "E'", 'T', "T'", 'F'])
		assert.deepEqual(first(pc), {
			"E" : ['(', 'id'],
			"E'": ['+', Production.EMPTY],
			"T" : ['(', 'id'],
			"T'": ['*', Production.EMPTY],
			"F" : ['(', 'id']
		})
	})

	QUnit.test('fail case', function (assert) {
		var pc = new ProductionCollection
		pc.add(new Production('A', ['A', 'a']))
		assert.equal(first(pc), null)
	})


	QUnit.test('sample1', function (assert) {
		var pc = pcStore.sample1()
		assert.deepEqual(first(pc), {
			E: ['id'],
			T: ['id'],
			F: ['+', Production.EMPTY]
		})
	})
})