var Production = require('./production')

class Follow {
	constructor(pc, endNonTerminal) {
		this._follows = {}
		this._pc = pc

		for (var nonTerminal of pc.getNonTerminals()) {
			this._follows[nonTerminal] = new Set
		}
		this.add(endNonTerminal, Production.END)
	}

	add(grammarSymbol, symbol) {
		this._follows[grammarSymbol].add(symbol)
	}

	addRange(grammarSymbol, symbolSet) {
		for (var value of symbolSet) {
			this.add(grammarSymbol, value)
		}
	}

	addTo(fromSymbol, toSymbol) {
		var from = this._follows[fromSymbol]
		this.addRange(toSymbol, from)
	}

	has(grammarSymbol, symbol) {
		return this._follows[grammarSymbol].has(symbol)
	}

	get(grammarSymbol) {
		return Array.from(this._follows[grammarSymbol])
	}

	toJSON() {
		return _.mapObject(this.toExtendJSON(), (followArray) => {
			return _.filter(followArray, (symbol) => this._pc.isTerminal(symbol))
		})
	}

	toExtendJSON() {
		return _.mapObject(this._follows, function (followSet) {
			return Array.from(followSet).sort()
		})
	}
}

module.exports = Follow