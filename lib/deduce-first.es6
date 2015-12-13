var Production = require('./data/production'),
    First      = require('./data/first'),
    _          = require('underscore')

// 计算FIRST(α)表:
// - 可从α推导得到的串的首符号的集合(终结符号)
// - ε也可能FIRST表中


// state is mark for algorithm of deduce-first
const STATE_NULL = 0
const STATE_DEDUCING = 1
const STATE_DEDUCED = 2


/** 计算FIRST表
 ** pc: ProductionCollection
 ** return: First
 */
module.exports = function (pc) {
	var first = new First(pc)

	var merge = function (fromSymbol, toSymbol, productionIndex) {
		// @日志: 如果需要扩展表的数据, 这里一定要用getExtend而不是get
		first.getExtend(fromSymbol).forEach((symbol) => {  // add extend data
			if (symbol != Production.EMPTY) {
				first.add(toSymbol, symbol, productionIndex)
			}
		})
	}

	var getState = function (symbol) {
		if (symbol in first._firsts) {
			return first._firsts[symbol]._state
		} else {
			return STATE_NULL
		}
	}

	var initState = function (symbol) {
		first._firsts[symbol]._state = STATE_DEDUCING
	}

	var finishState = function (symbol) {
		first._firsts[symbol]._state = STATE_DEDUCED
	}


	// recursive calc
	var deduce = function (nonTerminal) {
		switch (getState(nonTerminal)) {
			case STATE_NULL:
				break
			case STATE_DEDUCING:
				throw new Error('a loop there when deduce first at productionHead:' + nonTerminal)
			case STATE_DEDUCED:
				return
		}


		first.init(nonTerminal)
		initState(nonTerminal)

		var productions = pc.getProductionsBySymbol(nonTerminal)
		productions.forEach((production, productionIndex) => {
			var body = production.body()
			for (var i = 0; i < body.length; i++) {
				var bodySymbol = body[i]

				if (pc.isTerminal(bodySymbol)) {
					if (bodySymbol != Production.EMPTY) {
						first.add(nonTerminal, bodySymbol, productionIndex)
						break
					}
				} else {
					deduce(bodySymbol)
					merge(bodySymbol, nonTerminal, productionIndex)
					if (bodySymbol != Production.EMPTY) {
						// @日志: 如果需要扩展表的数据, 这里一定要把非终结符的bodySymbol也加上
						first.add(nonTerminal, bodySymbol, productionIndex) // process about extend first
					}
					if (!first.has(bodySymbol, Production.EMPTY)) {
						break
					}
				}
			}
			if (i == body.length) { // not break
				first.add(nonTerminal, Production.EMPTY, productionIndex)
			}
		})

		finishState(nonTerminal)
	}


	// deduce all non-terminals
	for (var nonTerminal of pc.getNonTerminals()) {
		deduce(nonTerminal)
	}

	return first
}
