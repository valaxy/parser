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
 ** return: a Object
 **     - key is symbol
 **     - value is Array, a collection of symbols, at index is each symbols of Production
 */
module.exports = function (pc) {
	var first = new First(pc)

	var mergeTo = function (fromSymbol, toSymbol, productionIndex) {
		first.get(fromSymbol).forEach((symbol) => {
			first.add(toSymbol, symbol, productionIndex)
		})
		first.get(fromSymbol).forEach((symbol) => {
			if (symbol != Production.EMPTY) {
				first.add(toSymbol, symbol)
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
	var deduce = function (productionHead) {
		switch (getState(productionHead)) {
			case STATE_NULL:
				break
			case STATE_DEDUCING:
				throw new Error('a loop there when deduce first')
			case STATE_DEDUCED:
				return
		}


		first.init(productionHead)
		initState(productionHead)

		var productions = pc.getProductionsBySymbol(productionHead)
		for (var productionIndex = 0; productionIndex < productions.length; productionIndex++) {
			var production = productions[productionIndex]
			var body = production.body()
			for (var i = 0; i < body.length; i++) {
				var bodySymbol = body[i]

				if (pc.isTerminal(bodySymbol)) {
					first.add(productionHead, bodySymbol, productionIndex)
					first.add(productionHead, bodySymbol)
					if (bodySymbol != Production.EMPTY) break
				} else {
					deduce(bodySymbol)
					mergeTo(bodySymbol, productionHead, productionIndex)
					if (!first.has(bodySymbol, Production.EMPTY)) break
				}
			}
			if (i == body.length) { // no break
				first.add(productionHead, Production.EMPTY)
			}
		}

		finishState(productionHead)
	}


	// deduce all non-terminals
	for (var nonTerminal of pc.getNonTerminals()) {
		deduce(nonTerminal)
	}

	return first
}
