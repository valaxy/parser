var Production  = require('./data/production'),
    _           = require('underscore'),
    deduceFirst = require('./deduce-first'),
    Follow      = require('./data/follow')


// 计算FOLLOW(A)
// - 在某些句型中紧跟在A右边的终结符号的集合
// - $也可能在FOLLOW表中
// - Algorithm reference:
//      - http://blog.csdn.net/ptsntwsz/article/details/6944474
//      - the Dragon book(second edition) 4.4.2

/*--------------------------------------------------------------------
 * @日志: 论类型推导工具为什么能帮助提供生产力
 * 两处bug的产生均是因为误解了变量的类型
 * 一处, 误以为first是object类型, 而实际是array类型
 *      var addFirstToSet = function (first, s) {
 *          for (var key in first) {
 *              s.add(key)
 *          }
 *      }
 * 二处, 误以为first[ch]是object类型, 而实际上是array类型
 *      addFirstToSet(_.keys(first[ch]), restFirst)
 *-------------------------------------------------------------------*/


var addFirstToSet = function (first, bodySymbol, _set) {
	first.get(bodySymbol).forEach(function (symbol) {
		_set.add(symbol)
	})
}

var deduce = function (pc, first, follow) {
	pc.getNonTerminals().forEach(function (nonTerminal) {
		pc.getProductionsBySymbol(nonTerminal).forEach(function (production) {
			var body = production.body()
			var isEmptyInGroup = true
			var groupFirstSetWithoutEmpty = new Set
			for (var i = body.length - 1; i >= 0; i--) {
				var bodySymbol = body[i] // count about bodySymbol

				if (pc.isTerminal(bodySymbol)) {
					// @bug log, should judge by bodySymbol equals or no equals Production.EMPTY
					if (bodySymbol == Production.EMPTY) {
						// @bug log: isEmptyInGroup don't need to change whether it is true or false
						// @bug log: groupFirstSetWithoutEmpty don't need to change
					} else {
						isEmptyInGroup = false
						groupFirstSetWithoutEmpty = new Set([bodySymbol])
					}
					continue
				}

				follow.addRange(bodySymbol, groupFirstSetWithoutEmpty)
				if (isEmptyInGroup) {
					follow.addTo(production.head(), bodySymbol)
				}

				// recount isEmptyInGroup & groupFirstSetWithoutEmpty
				if (first.has(bodySymbol, Production.EMPTY)) {
					// isEmptyInGroup don't need to change whether it is true or false
					addFirstToSet(first, bodySymbol, groupFirstSetWithoutEmpty)
					groupFirstSetWithoutEmpty.delete(Production.EMPTY) // after delete there is no empty
				} else {
					isEmptyInGroup = false
					groupFirstSetWithoutEmpty = new Set
					addFirstToSet(first, bodySymbol, groupFirstSetWithoutEmpty) // there is no empty
				}
				//groupFirstSetWithoutEmpty.add(bodySymbol) // process extend data
			}
		})
	})
}


var recordState = function (follow) {
	return _.map(follow._follows, function (followSet) {
		return followSet.size
	})
}

var isStateEqual = function (state1, state2) {
	if (state1.length != state2.length) {
		return false
	}

	for (var i = 0; i < state1.length; i++) {
		if (state1[i] != state2[i]) {
			return false
		}
	}
	return true
}


/** Deduce follow
 ** pc:             ProductionCollection
 ** endNonTerminal: 非终结符
 ** first:          optional first array
 */
var deduceFollow = function (pc, endNonTerminal, first = deduceFirst(pc)) {
	var follow = new Follow(pc, endNonTerminal)
	var state = recordState(follow)

	while (true) {
		deduce(pc, first, follow)
		var nextState = recordState(follow)
		if (isStateEqual(state, nextState)) { // there are no more changes to follow set
			break
		}
		state = nextState
	}
	return follow
}

deduceFollow._recordState = recordState

module.exports = deduceFollow