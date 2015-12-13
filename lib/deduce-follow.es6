var Production = require('./data/production')
var _ = require('underscore')
var deduceFirst = require('./deduce-first'),
    Follow      = require('./data/follow')


// 计算FOLLOW(A)
// - 在某些句型中紧跟在A右边的终结符号的集合
// - $也可能在FOLLOW表中
// - 算法参考: http://blog.csdn.net/ptsntwsz/article/details/6944474

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


var addFirstToSet = function (first, symbol, s) {
	first.get(symbol).forEach(function (key) {
		s.add(key)
	})
}

var deduce = function (pc, first, follow) {
	pc.getNonTerminals().forEach(function (nonTerminal) {
		pc.getProductionsBySymbol(nonTerminal).forEach(function (production) {
			var body = production.body()
			var allIsEmpty = true
			var restFirst = new Set
			for (var i = body.length - 1; i >= 0; i--) {
				var ch = body[i]
				if (pc.isTerminal(ch)) {
					allIsEmpty = false
					restFirst = new Set([ch])
					continue
				}

				if (allIsEmpty) {
					follow.addTo(production.head(), ch)
				}
				follow.addRange(ch, restFirst)

				if (first.has(ch, Production.EMPTY)) { // todo, bug!, 以前用的是 in xx(xx实际是个Array), 添加测试单元测试用例保证
					// keep allIsEmpty
					addFirstToSet(first, ch, restFirst)
					restFirst.delete(Production.EMPTY)
				} else {
					allIsEmpty = false
					restFirst = new Set
					addFirstToSet(first, ch, restFirst)
				}
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


/**
 ** pc:             ProductionCollection
 ** endNonTerminal: 非终结符
 ** first:          optional first array
 */
var getFollow = function (pc, endNonTerminal, first = deduceFirst(pc)) {
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

getFollow._recordState = recordState

module.exports = getFollow


//// follow is a set of object
//var initFollow = function (pd, endNonTerminal) {
//	var follow = {}
//	for (var nonTerminal of pd.getNonTerminals()) {
//		follow[nonTerminal] = new Set
//	}
//	follow[endNonTerminal].add(Production.END)
//	return follow
//}