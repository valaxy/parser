var dfs           = require('algorithm-data-structure/dest/search/deep-first'),
    Stack         = require('algorithm-data-structure/dest/linear-list/stack'),
    deducePredict = require('./deduce-predict'),
    Production    = require('./data/production'),
    _             = require('underscore')

var ll = function (tokens, head, pc) {
	var predict = deducePredict(pc, head)
	var stack = new Stack
	var index = 0
	stack.push(head)

	while (index < tokens.length && !stack.isEmpty()) {
		var token = tokens[index]
		var symbol = stack.peek() // todo, 要求抛错
		console.log('symbol', symbol, 'token', token, 'length')
		if (pc.isTerminal(symbol)) {
			if (symbol == Production.EMPTY) {
				stack.pop()
				continue
			}
			if (symbol != token) throw new Error('这里不相等噢')
			stack.pop() // match
			index++
		} else {
			var production = predict.getPredict(symbol, token)
			if (!production) throw new Error('这里不存在噢symbol:' + symbol + ',token:' + token)
			stack.pop()
			for (var s of _.clone(production.body()).reverse()) { // todo, body()有副作用
				stack.push(s)
			}
			console.log(production)
		}
	}
}


module.exports = ll



