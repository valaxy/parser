var _ = require('underscore')

const STATE_DEFAULT = 0
const STATE_CHECKING = 1
const STATE_CHECKED = 2

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
		firstSymbolResult.state = STATE_CHECKING    // mark for algorithm of deduce-first
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
	add(grammarSymbol, symbol, productionIndex) {
		var firstSymbolResult = this._firsts[grammarSymbol]
		if (firstSymbolResult.total.has(symbol)) throw new Error('symbol:' + symbol + ' already exist in headSymbol:' + grammarSymbol)

		firstSymbolResult.total.add(symbol)
		firstSymbolResult[productionIndex].add(symbol)
		return this
	}

	has(grammarSymbol, symbol, index = -1) {
		var position = index < 0 ? 'total' : String(index)
		return grammarSymbol in this._firsts && this._firsts[grammarSymbol][position].has(symbol)
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