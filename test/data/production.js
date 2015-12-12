define(function (require) {
	var Production = require('cjs!../../dist/data/production')

	QUnit.module('Production')

	QUnit.test('constructor', function (assert) {
		var p = new Production('S')
		assert.equal(p.head(), 'S')
		assert.deepEqual(p.body(), [Production.EMPTY])

		p = new Production('S', ['c', 'A', 'd'])
		assert.deepEqual(p.body(), ['c', 'A', 'd'])
	})

	QUnit.test('head()', function (assert) {
		var p = new Production('A')
		p.head('X')
		assert.equal(p.head(), 'X')
	})

	QUnit.test('body()', function (assert) {
		var p = new Production('A', ['a', 'b', 'c'])
		p.body().splice(0, 0, 'd')
		assert.deepEqual(p.body(), ['d', 'a', 'b', 'c'])

		p.body(['1', '2'])
		assert.deepEqual(p.body(), ['1', '2'])
	})
})