import Follow               from '../../lib/data/follow'
import ProductionCollection from '../../lib/data/production-collection'
import Production           from '../../lib/data/production'

QUnit.module('Follow')

QUnit.test('addRange()/toJSON()/toExtendJSON()', function (assert) {
    var follow = new Follow(new ProductionCollection([
        ['A'], ['B']
    ]), 'A')

    assert.deepEqual(follow.toExtendJSON(), {
        A: [Production.END],
        B: []
    })

    follow.addRange('A', new Set(['a', 'B']))
    assert.deepEqual(follow.toJSON(), {
        A: [Production.END, 'a'],
        B: []
    })
    assert.deepEqual(follow.toExtendJSON(), {
        A: [Production.END, 'B', 'a'],
        B: []
    })
})

QUnit.test('add()/has()', function (assert) {
    var follow = new Follow(new ProductionCollection([
        ['A'], ['B']
    ]), 'A')
    assert.ok(!follow.has('A', 'a'))

    follow.add('A', 'a')
    assert.ok(follow.has('A', 'a'))
})