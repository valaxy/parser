var Production = require('./production')

// 计算FIRST(α)表:
// - 可从α推导得到的串的首符号的集合(终结符号)
// - ε也可能FIRST表中

var getIncrementArray = function (begin, count) {
	var ary = []
	for (var number = begin; number < count; number++) {
		ary[number - begin] = number
	}
	return ary
}


/** 计算FIRST表
 ** pc: ProductionCollection
 ** return: a Object
 **     - key is symbol
 **     - value is Array, a collection of symbols, at index is each symbols of Production
 */
module.exports = function (pc) {
	// key is symbol
	// value is object:
	//      state:    1:checking, 2:checked
	//      result:   first result
	//      0,1,2,..: result for production
	var first = {}


	var addToFirst = function (calculatedFirstItem, targetFirstItem, index) {
		for (var symbol in calculatedFirstItem.result) {
			targetFirstItem.result[symbol] = true
			targetFirstItem[index][symbol] = true
		}
		delete targetFirstItem.result[Production.EMPTY]
		delete targetFirstItem[index][Production.EMPTY]
	}


	var initFirstItem = function (symbol, productions) {
		var firstItem = first[symbol] = {}
		firstItem.state = 1
		firstItem.result = {}
		firstItem.length = productions.length
		for (var i = 0; i < productions.length; i++) {
			firstItem[i] = {}
		}
	}

	var fillNonTerminalFirstItem = function (firstItem, symbol) {
		firstItem.result[symbol] = true
		firstItem.state = 2
	}


	// recursive calc
	var calc = function (productionHead) {
		if (productionHead in first) {
			if (first[productionHead].state == 2) {
				return 0 // ok
			} else if (first[productionHead].state == 1) {
				return null // a loop there
			}
		}

		var productions = pc.getProductionsBySymbol(productionHead)
		initFirstItem(productionHead, productions)

		if (pc.isTerminal(productionHead)) {
			fillNonTerminalFirstItem(first[productionHead], productionHead)
			return 0 // ok
		}

		for (var i = 0; i < productions.length; i++) {
			var production = productions[i]
			var body = production.body()
			for (var j = 0; j < body.length; j++) {
				var ch = body[j]
				var result = calc(ch)
				if (result === null) {
					return null // a loop there
				}

				addToFirst(first[ch], first[productionHead], i)

				if (!(Production.EMPTY in first[ch].result)) {
					break
				}
			}
			if (j == body.length) { // no break
				first[productionHead].result[Production.EMPTY] = true // add empty
				first[productionHead][i][Production.EMPTY] = true
			}
		}

		first[productionHead].state = 2
		return 0 // ok
	}


	// calc all non-terminals
	for (var nonTerminal of pc.getNonTerminals()) {
		if (calc(nonTerminal) === null) {
			console.warn('loop warn', first)
			throw new Error('a loop there')
		}
	}

	return _.pick(
		_.mapObject(first, function (eachFirstItem) {
			var pickKeys = getIncrementArray(0, eachFirstItem.length)
			pickKeys.push('result')

			// build data
			var result = {}
			for (var key of pickKeys) {
				result[key] = _.keys(eachFirstItem[key]).sort()
			}
			return result
		}),
		function (value, key) {
			return pc.isNonTerminal(key)
		})
}
