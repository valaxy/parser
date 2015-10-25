define(function (require) {
	var ProductionCollection = require('cjs!../dist/production-collection')
	var Production = require('cjs!../dist/production')

	QUnit.module('ProductionCollection')

	QUnit.test('isTerminal()/isNonTerminal()', function (assert) {
		var pd = new ProductionCollection
		assert.ok(pd.isTerminal('A'))
		assert.ok(!pd.isNonTerminal('A'))

		pd.add(new Production('A'), ['A', 'b'])
		assert.ok(!pd.isTerminal('A'))
		assert.ok(pd.isNonTerminal('A'))
		assert.ok(pd.isTerminal('b'))
		assert.ok(!pd.isNonTerminal('b'))
	})

	QUnit.test('getNonTerminals()', function (assert) {
		var pd = new ProductionCollection
		assert.deepEqual(pd.getNonTerminals(), [])

		pd.add(new Production('A', ['a', 'A', 'B']))
		assert.deepEqual(pd.getNonTerminals(), ['A'])

		pd.add(new Production('B', ['b']))
		assert.deepEqual(pd.getNonTerminals(), ['A', 'B'])

		pd.add(new Production('A'))
		assert.deepEqual(pd.getNonTerminals(), ['A', 'B'])
	})


	QUnit.test('getProductionsBySymbol()', function (assert) {
		var pd = new ProductionCollection
		var p1 = new Production('A')
		var p2 = new Production('B')
		var p3 = new Production('A')
		pd.add(p1)
		pd.add(p2)
		pd.add(p3)
		assert.deepEqual(pd.getProductionsBySymbol('A'), [p1, p3])
		assert.deepEqual(pd.getProductionsBySymbol('B'), [p2])
		assert.deepEqual(pd.getProductionsBySymbol('C'), [])
	})

	QUnit.test('eachProduction()', function (assert) {
		var pd = new ProductionCollection([
			['A', []],
			['B', []],
			['B', ['a']],
			['C', ['a', 'b']]
		])

		var result = []
		pd.eachProduction(function (production) {
			result.push(production.head())
		})
		assert.deepEqual(result, ['A', 'B', 'B', 'C'])
	})

})