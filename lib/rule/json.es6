var ProductionCollection = require('../data/production-collection')

var json = new ProductionCollection([
	['value', ['boolean']],
	['value', ['string']],
	['value', ['number']],
	['value', ['object']],
	['value', ['array']],
	['object', ['{', 'objectBody', '}']],
	['objectBody'],
	['objectBody', ['objectMember', 'objectMembers']],
	['objectMembers'],
	['objectMembers', [',', 'objectMembers']],
	['objectMember', ['string', ':', 'value']],
	['array', ['[', 'arrayBody', ']']],
	['arrayBody'],
	['arrayBody', ['value', 'arrayMembers']],
	['arrayMembers'],
	['arrayMembers', [',', 'value']]
])

module.exports = json