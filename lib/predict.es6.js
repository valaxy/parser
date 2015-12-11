var getFirst = require('./first')
var getFollow = require('./follow')
var PredictTable = require('./predict-table')
var Production = require('./production')


/** 计算预测分析表 */
module.exports = function (pc, endNonTerminal) {
	var first = getFirst(pc)
	var follow = getFollow(pc, endNonTerminal)
	var predictTable = new PredictTable()
	predictTable._first = first
	predictTable._follow = follow

	pc.eachProduction(function (production) {
		var head = production.head()
		first[head].forEach(function (symbol) {
			if (symbol != Production.EMPTY) {
				predictTable.setPredict(head, symbol, production)
				console.log(head, symbol, 222)
			}
		})
		if (first[head].indexOf(Production.EMPTY) >= 0) {
			follow[head].forEach(function (symbol) {
				console.log(head, symbol, 333)
				predictTable.setPredict(head, symbol, production)
			})
		}
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