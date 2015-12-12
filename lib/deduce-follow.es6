var Production = require('./data/production')
var _ = require('underscore')
var deduceFirst = require('./deduce-first')


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


var followToJSON = function (follow) {
	return _.mapObject(follow, function (s) {
		return Array.from(s).sort()
	})
}

// add follow1 to follow2
var addSetToSet = function (follow1, follow2) {
	for (var s of follow1) {
		follow2.add(s)
	}
}

var addFirstToSet = function (firstItem, s) {
	for (var key of firstItem.total) {
		s.add(key)
	}
}

var calc = function (pc, first, follow) {
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
					addSetToSet(follow[production.head()], follow[ch])
				}
				addSetToSet(restFirst, follow[ch])

				if (first[ch].total.indexOf(Production.EMPTY) >= 0) { // todo, bug!, 以前用的是 in xx, 添加测试单元测试用例保证
					// keep allIsEmpty
					addFirstToSet(first[ch], restFirst)
					restFirst.delete(Production.EMPTY)
				} else {
					allIsEmpty = false
					restFirst = new Set(first[ch].total)
				}
			}
		})
	})
}


var recordState = function (follow) {
	return _.map(follow, function (x) {
		return x.size
	})
}

var isStateEqual = function (state1, state2) {
	if (state1.length != state2.length) { // count
		return false
	}

	for (var i = 0; i < state1.length; i++) {
		if (state1[i] != state2[i]) {
			return false
		}
	}
	return true
}


// follow is a set of object
var initFollow = function (pd, endNonTerminal) {
	var follow = {}
	for (var nonTerminal of pd.getNonTerminals()) {
		follow[nonTerminal] = new Set
	}
	follow[endNonTerminal].add(Production.END)
	return follow
}


/**
 ** pc:             ProductionCollection
 ** endNonTerminal: 非终结符
 ** first:          optional first array
 */
var getFollow = function (pc, endNonTerminal, first = deduceFirst(pc)) {
	var follow = initFollow(pc, endNonTerminal)
	var state = recordState(follow)
	while (true) {
		calc(pc, first, follow)
		var nextState = recordState(follow)
		if (isStateEqual(state, nextState)) { // there are no more changes to follow set
			break
		}
		state = nextState
	}
	return follow
}

getFollow._initFollow = initFollow
getFollow._recordState = recordState
getFollow._followToJSON = followToJSON

module.exports = getFollow
