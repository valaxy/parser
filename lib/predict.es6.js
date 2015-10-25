define(function (require) {
	var getFirst = require('./first')
	var getFollow = require('./follow')



	/** 预测分析表 */
	return function (pd, endNonTerminal) {
		var first = getFirst(pd)
		var follow = getFollow(pd, endNonTerminal)

		return new PredictTable()
	}
})