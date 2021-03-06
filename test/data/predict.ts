import Predict from '../../lib/data/predict'

QUnit.module('Predict')

QUnit.test('getPredict()/setPredict()', function (assert) {
    var pt = new Predict
    assert.equal(pt.getPredict('A', 'a'), null)

    pt.setPredict('A', 'a', 1)
    assert.equal(pt.getPredict('A', 'a'), 1)
})

QUnit.test('toJSON()', function (assert) {
    var pt = new Predict
    assert.deepEqual(pt.toJSON(), {})

    pt.setPredict('A', 'a', 1)
    assert.deepEqual(pt.toJSON(), {
        A: {a: 1}
    })

    pt.setPredict('A', 'b', 2)
    pt.setPredict('B', 'a', 1)
    assert.deepEqual(pt.toJSON(), {
        A: {a: 1, b: 2},
        B: {a: 1}
    })
})