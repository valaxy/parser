var _ = require('underscore')

// each item:
//      total:    total result
//      0,1,2,..: for each production result
class First {
	constructor(productionCollection) {
		this._firsts = {}
		this._pc = productionCollection
	}

	/** Only called once for each grammarSymbol */
	init(grammarSymbol) {
		if (grammarSymbol in this._firsts) throw new Error('headSymbol:' + grammarSymbol + ' already init')
		var productionCount = this._pc.getProductionsBySymbol(grammarSymbol).length

		var firstSymbolResult = this._firsts[grammarSymbol] = {}
		firstSymbolResult.length = productionCount  // how many sub productions of headSymbol for algorithm of deduce-first

		// total-set is union of each independent index-set
		// each index-set is non-intersect
		var keys = _.range(productionCount)
		keys.push('total')
		keys.forEach(function (key) {
			firstSymbolResult[key] = new Set
		})
		return this
	}

	/** Called Before init() */
	add(grammarSymbol, symbol, productionIndex = -1) {
		var firstSymbolResult = this._firsts[grammarSymbol]
		if (productionIndex < 0) {
			firstSymbolResult.total.add(symbol)
		} else {
			firstSymbolResult[productionIndex].add(symbol)
		}
		return this
	}

	/** Called Before init() */
	has(grammarSymbol, symbol, productionIndex = -1) {
		var position = productionIndex < 0 ? 'total' : String(productionIndex)
		return grammarSymbol in this._firsts && this._firsts[grammarSymbol][position].has(symbol)
	}

	/** Called Before init() */
	get(grammarSymbol, productionIndex = -1) {
		var firstSymbolResult = this._firsts[grammarSymbol]
		if (productionIndex < 0) {
			return Array.from(firstSymbolResult.total)
		} else {
			return Array.from(firstSymbolResult[productionIndex])
		}
	}

	toJSON() {
		return _.mapObject(this._firsts, (eachFirstSymbolResult) => {
			var result = {length: eachFirstSymbolResult.length}
			var pickKeys = _.range(eachFirstSymbolResult.length)
			pickKeys.push('total')

			// build data
			for (var key of pickKeys) {
				result[key] = _.filter(
					Array.from(eachFirstSymbolResult[key]),
					(symbol) => this._pc.isTerminal(symbol)
				).sort()
			}
			return result
		})
	}

	toExtendJSON() {
		return _.mapObject(this._firsts, (eachFirstSymbolResult) => {
			var result = {length: eachFirstSymbolResult.length}
			var pickKeys = _.range(eachFirstSymbolResult.length)
			pickKeys.push('total')

			// build data
			for (var key of pickKeys) {
				result[key] = Array.from(eachFirstSymbolResult[key]).sort()
			}
			return result
		})
	}
}

module.exports = First

//**     - key is symbol
//**     - value is Array, a collection of symbols, at index is each symbols of Production