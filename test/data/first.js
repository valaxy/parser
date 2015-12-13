define(function (require) {
	var First                = require('cjs!../../dist/data/first'),
	    ProductionCollection = require('cjs!../../dist/data/production-collection')

	QUnit.module('First')

	var createFirst = function () {
		return new First(new ProductionCollection([
			['A', ['a', 'b', 'B']],
			['A'],
			['B', ['a']]
		]))
	}

	QUnit.test('init()/toJSON()/toExtendJSON()', function (assert) {
		var first = createFirst()
		assert.deepEqual(first.toJSON(), {})
		assert.deepEqual(first.toExtendJSON(), {})

		// after init
		first.init('A')
		assert.deepEqual(first.toJSON(), {
			A: {
				length: 2,
				0     : [],
				1     : [],
				total : []
			}
		})
		assert.deepEqual(first.toExtendJSON(), {
			A: {
				length: 2,
				0     : [],
				1     : [],
				total : []
			}
		})


		// after add
		first.init('B')
		first.add('A', 'a', 1)
		first.add('B', 'A', 0)
		assert.deepEqual(first.toJSON(), {
			A: {
				length: 2,
				0     : [],
				1     : ['a'],
				total : ['a']
			},
			B: {
				length: 1,
				0     : [],
				total : []
			}
		})
		assert.deepEqual(first.toExtendJSON(), {
			A: {
				length: 2,
				0     : [],
				1     : ['a'],
				total : ['a']
			},
			B: {
				length: 1,
				0     : ['A'],
				total : ['A']
			}
		})
	})

	QUnit.test('add()/has()', function (assert) {
		var first = createFirst()
		assert.ok(!first.has('A', 'a'))
		assert.ok(!first.has('A', 'a', 0))

		first.init('A').add('A', 'a', 0)
		assert.ok(first.has('A', 'a'))
		assert.ok(first.has('A', 'a', 0))
	})

	QUnit.test('ok()', function (assert) {
		assert.ok(true)
	})
})