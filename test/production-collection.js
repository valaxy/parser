define(function (require) {
	var ProductionCollection = require('es6!../lib/production-collection')
	var Production = require('es6!../lib/production')

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


})