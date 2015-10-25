var getFirst = require('./first')
var getFollow = require('./follow')
var PredictTable = require('./predict-table')
var Production = require('./production')


/** 预测分析表 */
module.exports = function (pd, endNonTerminal) {
	var first = getFirst(pd)
	var follow = getFollow(pd, endNonTerminal)

	var pt = new PredictTable()

	pt.eachProduction(function (production) {
		var head = production.head()
		var firstSymbol = production.body()[0]
		if (firstSymbol == Production.EMPTY) {
			for (var x of follow[production.head()]) {
				pt.setPredict(head, x, production)
			}
		} else if (pd.isTerminal(firstSymbol)) { // but is not empty
			pt.setPredict(head, firstSymbol)
		} else { // non terminal
			var firstSymbolFirst = first[firstSymbol]
			
		}
	})
}
