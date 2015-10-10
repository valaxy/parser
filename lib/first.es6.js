define(function (require) {

	var getTerminalMark = function (productions) => {
		var terminals = {}

		// all head is non terminals
		productions.forEach(function (production) {
			terminals[production.head()] = false
		})

		// the rest symbols no appear in head are terminals
		productions.forEach(function (production) {
			production.body().forEach(function (symbol) {
				if (!symbol in terminals) {
					terminals[symbol] = true
				}
			})
		})
		return terminals
	}


	return function (pd, list) {
		// symbol:
		//      state: 1:checking, 2:checked
		//      result:
		var first = {}


		// s1 add to s2
		var addToFirst = function (s1, s2) {
			for (var symbol in s1) {
				s2[symbol] = true
			}
			delete s2[Production.EMPTY]
		}


		// recursive calc
		var calc = function (symbol) {
			if (symbol in first) {
				if (first[symbol].state == 2) {
					return first[symbol].result
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
				return 0
			}

			var productions = list.getProductionsBySymbol(symbol)
			for (var j = 0; j < productions.length; j++) {
				var production = productions[j]
				var body = production.body()
				for (var i = 0; i < body.length; i++) {
					var result = calc(body[i])
					if (result === null) {
						return null // a loop there
					}

					addToFirst(first[body[i]].result, first[symbol].result)
					if (Production.EMPTY in first[body[i]]) {
						continue
					} else {
						break
					}
				}
				first[symbol][Production.EMPTY] = true // add empty
			}

			return 0
		}


		// calc all non-terminals
		pd.getNonTerminals().forEach(function (nonTerminal) {
			calc(nonTerminal)
		})
	}
})
