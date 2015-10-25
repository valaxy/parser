var _ = require('underscore')
var Production = require('./production')

class ProductionCollection {
	constructor(rawProductions = []) {
		this._p = {}
		this._nonTerminals = {}

		rawProductions.forEach((raw) => {
			this.add(new Production(raw[0], raw[1]))
		})
	}

	add(production) {
		if (!(production.head() in this._p)) {
			this._p[production.head()] = []
		}
		this._p[production.head()].push(production)
		this._nonTerminals[production.head()] = true
	}

	/** 终结符 */
	isTerminal(symbol) {
		return !this.isNonTerminal(symbol)
	}

	/** 非终结符 */
	isNonTerminal(symbol) {
		return symbol in this._nonTerminals
	}

	getNonTerminals() {
		return _.keys(this._nonTerminals)
	}

	getProductionsBySymbol(symbol) {
		if (symbol in this._p) {
			return _.clone(this._p[symbol])
		} else {
			return []
		}
	}
}

module.exports = ProductionCollection
