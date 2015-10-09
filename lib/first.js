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


	return function (list) {
		var terminals = getTerminalMark(list)
		var first = {}

		var isTerminal = function (symbol) {
			return terminals[symbol] === true
		}

		// s1 add to s2
		var addToFirst = function (s1, s2) {
			for (var symbol in s1) {
				s2[symbol] = true
			}
			delete s2[Production.EMPTY]
		}


		// recursive calc
		var calc = function (symbol) {
			if (isTerminal(symbol)) {
				first[symbol] = symbol
				return
			}

			if (symbol === Production.EMPTY) {

			}


			list.getProductionsBySymbol(symbol).forEach(function (production) {
				var body = production.body()
				for (var i = 0; i < body.length; i++) {
					addToFirst(first[body[i]], first[symbol])
					if (Production.EMPTY in first[body[i]]) {
						continue
					} else {
						break
					}
				}
				first[symbol][Production.EMPTY] = true // add empty
			})
		}


		list.getSymbols().forEach(function (symbol) {
			if (!mark[symbol]) {


			}
			calc(symbol)
		})

	}
})