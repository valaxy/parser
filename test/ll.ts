define(function (require) {
	var ll         = require('cjs!../ll'),
	    pcStore    = require('./pc-store'),
	    Production = require('cjs!../lib/data/production')

	QUnit.module('ll')

	QUnit.test('xx', function (assert) {
		var pc = pcStore.sample1()
		ll(['id', '+', 'id', '+', 'id', Production.END], 'E', pc)
		assert.ok(true)
	})
})