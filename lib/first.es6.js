define(function (require) {
	var Production = require('./production')

	return function (pd) {
		// symbol:
		//      state:  1:checking, 2:checked
		//      result: first result
		var first = {}


		// first1 add to first2
		var addToFirst = function (first1, first2) {
			for (var symbol in first1.result) {
				first2.result[symbol] = true
			}
		}


		// recursive calc
		var calc = function (symbol) {
			if (symbol in first) {
				if (first[symbol].state == 2) {
					return 0 // ok
				} else if (first[symbol].state == 1) {
					return null // a loop there
				}
			}


			first[symbol] = {
				state : 1,
				result: {}
			}

			if (pd.isTerminal(symbol)) {
				first[symbol].result[symbol] = true
				first[symbol].state = 2
				return 0 // ok
			}

			var productions = pd.getProductionsBySymbol(symbol)
			for (var i = 0; i < productions.length; i++) {
				var production = productions[i]
				var body = production.body()
				for (var j = 0; j < body.length; j++) {
					var ch = body[j]
					var result = calc(ch)
					if (result === null) {
						return null // a loop there
					}

					addToFirst(first[ch], first[symbol])
					delete first[symbol].result[Production.EMPTY]

					if (!(Production.EMPTY in first[ch].result)) {
						break
					}
				}
				if (j == body.length) { // no break
					first[symbol].result[Production.EMPTY] = true // add empty
				}
			}

			first[symbol].state = 2
			return 0 // ok
		}


		// calc all non-terminals
		for (var nonTerminal of pd.getNonTerminals()) {
			if (calc(nonTerminal) === null) {
				console.log('a loop there', first)
				return null
			}
		}

		return _.pick(_.mapObject(first, function (val) {
			return _.keys(val.result).sort()
		}), function (value, key) {
			return pd.isNonTerminal(key)
		})
	}
})
