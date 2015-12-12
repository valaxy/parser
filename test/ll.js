define(function (require) {
	var ll         = require('cjs!../dist/ll'),
	    pcStore    = require('./pc-store'),
	    Production = require('cjs!../dist/data/production')

	QUnit.module('ll')

	QUnit.test('xx', function (assert) {
		var pc = pcStore.sample1()
		ll(['id', '+', 'id', '+', 'id', Production.END], 'E', pc)
		assert.ok(true)
	})
})