var deduceFirst = require('./deduce-first')
var deduceFollow = require('./deduce-follow')
var PredictTable = require('./data/predict')
var Production = require('./data/production')


/** 计算预测分析表 */
module.exports = function (pc, endNonTerminal) {
	var first = deduceFirst(pc)
	var follow = deduceFollow(pc, endNonTerminal, first)
	var predictTable = new PredictTable()
	predictTable._first = first
	predictTable._follow = follow


	pc.getNonTerminals().forEach(function (head) {
		pc.getProductionsBySymbol(head).forEach(function (production, index) {
			var firstSymbols = first.get(head, index)
			firstSymbols.forEach(function (symbol) {
				if (symbol != Production.EMPTY) {
					predictTable.setPredict(head, symbol, production)
				}
			})
			if (firstSymbols.indexOf(Production.EMPTY) >= 0) {
				follow.get(head).forEach(function (symbol) {
					predictTable.setPredict(head, symbol, production)
				})
			}
		})
	})


	return predictTable
}


//var firstSymbol = production.body()[0]
//if (firstSymbol == Production.EMPTY) {
//	for (var x of follow[production.head()]) {
//		pt.setPredict(head, x, production)
//	}
//} else if (pd.isTerminal(firstSymbol)) { // but is not empty
//	pt.setPredict(head, firstSymbol)
//} else { // non terminal
//
//	//var firstSymbolFirst = first[firstSymbol]
//}