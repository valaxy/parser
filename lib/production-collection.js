import _ from '_'

class ProductionCollection {
	constructor() {
		this._p = {}
		this._nonTerminals = {}
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


export default ProductionCollection