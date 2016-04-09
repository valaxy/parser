define(function (require) {
	var deduceFirst          = require('cjs!../deduce-first'),
	    ProductionCollection = require('cjs!../data/production-collection'),
	    Production           = require('cjs!../data/production'),
	    pcStore              = require('./pc-store')

	QUnit.module('deduceFirst()')

	QUnit.test('case1', function (assert) {
		var pc = new ProductionCollection([
			['A', ['a', 'b']]
		])
		assert.deepEqual(deduceFirst(pc).toJSON(), {
			A: {
				0     : ['a'],
				total : ['a'],
				length: 1
			}
		})
	})

	QUnit.test('case2', function (assert) {
		var pc = new ProductionCollection([
			['A', ['a', 'b', 'B']],
			['B', ['b', 'c']]
		])
		assert.deepEqual(deduceFirst(pc).toJSON(), {
			A: {
				0     : ['a'],
				total : ['a'],
				length: 1
			},
			B: {
				0     : ['b'],
				total : ['b'],
				length: 1
			}
		})
	})

	QUnit.test('case3', function (assert) {
		var pc = new ProductionCollection([
			['A', ['a', 'b']],
			['A', ['b', 'c']]
		])
		assert.deepEqual(deduceFirst(pc).toJSON(), {
			A: {
				0     : ['a'],
				1     : ['b'],
				total : ['a', 'b'],
				length: 2
			}
		})
	})

	QUnit.test('case4', function (assert) {
		var pc = new ProductionCollection([
			['S', ['c', 'A', 'd']],
			['A', ['a', 'b']],
			['A', ['a']]
		])
		assert.deepEqual(deduceFirst(pc).toJSON(), {
			S: {
				0     : ['c'],
				total : ['c'],
				length: 1
			},
			A: {
				0     : ['a'],
				1     : ['a'],
				total : ['a'],
				length: 2
			}
		})
	})

	QUnit.test('case5', function (assert) {
		var pc = new ProductionCollection([
			['S', [Production.EMPTY, 'a']]
		])
		assert.deepEqual(deduceFirst(pc).toJSON(), {
			S: {
				0     : ['a'],
				total : ['a'],
				length: 1
			}
		})
	})


	QUnit.test('case6', function (assert) {
		var pc = new ProductionCollection([
			['A', ['B', 'a']],
			['B'],
			['B', ['b']]
		])
		assert.deepEqual(deduceFirst(pc).toExtendJSON(), {
			A: {
				0     : ['B', 'a', 'b'],
				total : ['B', 'a', 'b'],
				length: 1
			},
			B: {
				0     : [Production.EMPTY],
				1     : ['b'],
				total : [Production.EMPTY, 'b'],
				length: 2
			}
		})
	})

	QUnit.test('fail case', function (assert) {
		var pc = new ProductionCollection([
			['A', ['A', 'a']]
		])
		assert.throws(function () {
			deduceFirst(pc)
		})
	})


	QUnit.test('sample1', function (assert) {
		var pc = pcStore.sample1()
		assert.deepEqual(deduceFirst(pc).toJSON(), {
			E: {
				0     : ['id'],
				total : ['id'],
				length: 1
			},
			T: {
				0     : ['id'],
				total : ['id'],
				length: 1
			},
			F: {
				0     : ['+'],
				1     : [Production.EMPTY],
				total : ['+', Production.EMPTY],
				length: 2
			}
		})
	})


	QUnit.test('sample2', function (assert) {
		var pc = pcStore.sample2()
		assert.deepEqual(pc.getNonTerminals(), ['E', 'EE', 'T', 'TT', 'F'])
		assert.deepEqual(deduceFirst(pc).toJSON(), {
			E : {
				0     : ['(', 'id'],
				total : ['(', 'id'],
				length: 1
			},
			EE: {
				0     : ['+'],
				1     : [Production.EMPTY],
				total : ['+', Production.EMPTY],
				length: 2
			},
			T : {
				0     : ['(', 'id'],
				total : ['(', 'id'],
				length: 1
			},
			TT: {
				0     : ['*'],
				1     : [Production.EMPTY],
				total : ['*', Production.EMPTY],
				length: 2
			},
			F : {
				0     : ['('],
				1     : ['id'],
				total : ['(', 'id'],
				length: 2
			}
		})
	})

	QUnit.test('sample3', function (assert) {
		var pc = pcStore.sample3()
		assert.deepEqual(pc.getNonTerminals(), ['value', 'object', 'member', 'members'])
		assert.deepEqual(deduceFirst(pc).toExtendJSON(), {
			value  : {
				0     : ['VALUE'],
				1     : ['object', '{'],
				total : ['VALUE', 'object', '{'],
				length: 2
			},
			object : {
				0     : ['{'],
				total : ['{'],
				length: 1
			},
			member : {
				0     : ['KEY'],
				total : ['KEY'],
				length: 1
			},
			members: {
				0     : [Production.EMPTY],
				1     : ['KEY', 'member'],
				total : [Production.EMPTY, 'KEY', 'member'],
				length: 2
			}
		})
	})


	QUnit.test('sample json', function (assert) {
		var pc = require('cjs!../lib/rule/json')
		assert.deepEqual(pc.getNonTerminals(), ['value', 'object', 'objectBody', 'objectMembers', 'objectMember', 'array', 'arrayBody', 'arrayMembers'])
		assert.deepEqual(deduceFirst(pc).toExtendJSON(), {
			value        : {
				0     : ['boolean'],
				1     : ['string'],
				2     : ['number'],
				3     : ['object', '{'],
				4     : ['[', 'array'],
				total : ['[', 'array', 'boolean', 'number', 'object', 'string', '{'],
				length: 5
			},
			object       : {
				0     : ['{'],
				total : ['{'],
				length: 1
			},
			objectBody   : {
				0     : [Production.EMPTY],
				1     : ['objectMember', 'string'],
				total : [Production.EMPTY, 'objectMember', 'string'],
				length: 2
			},
			objectMembers: {
				0     : [Production.EMPTY],
				1     : [','],
				total : [',', Production.EMPTY],
				length: 2
			},
			objectMember : {
				0     : ['string'],
				total : ['string'],
				length: 1
			},
			array        : {
				0     : ['['],
				total : ['['],
				length: 1
			},
			arrayBody    : {
				0     : [Production.EMPTY],
				1     : ['[', 'array', 'boolean', 'number', 'object', 'string', 'value', '{'],
				total : [Production.EMPTY, '[', 'array', 'boolean', 'number', 'object', 'string', 'value', '{'],
				length: 2
			},
			arrayMembers : {
				0     : [Production.EMPTY],
				1     : [','],
				total : [',', Production.EMPTY],
				length: 2
			}
		})
	})

})