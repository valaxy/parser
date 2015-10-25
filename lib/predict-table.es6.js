class PredictTable {
	constructor() {
		this._predict = {}
	}

	setPredict(nonTerminal, nextSymbol, production) {
		if (this.getPredict(nonTerminal, nextSymbol)) {
			throw new Error(nonTerminal + ' has production on ' + nextSymbol)
		}
		if (!(nonTerminal in this._predict)) {
			this._predict[nonTerminal] = {}
		}
		this._predict[nonTerminal][nextSymbol] = production
	}


	/** null or Production */
	getPredict(nonTerminal, nextSymbol) {
		if (!(nonTerminal in this._predict) || !(nextSymbol in this._predict[nonTerminal])) {
			return null
		}
		return this._predict[nonTerminal][nextSymbol]
	}

	toJSON() {
		return this._predict
	}
}

module.exports = PredictTable