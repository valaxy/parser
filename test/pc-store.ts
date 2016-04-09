define(function (require) {
	var ProductionCollection = require('cjs!../lib/production-collection'),
	    Production           = require('cjs!../lib/production')


	return {
		// id
		// id+id
		// id+id+id+id
		sample1: function () {
			return new ProductionCollection([
				['E', ['T', 'F']], // <- root
				['T', ['id']],
				['F', ['+', 'E']],
				['F']
			])
		},

		// id
		// (id)
		// id+id
		// id+id*id+id
		sample2: function () {
			return new ProductionCollection([
				['E', ['T', 'EE']], // <- root
				['EE', ['+', 'T', 'EE']],
				['EE', [Production.EMPTY]],
				['T', ['F', 'TT']],
				['TT', ['*', 'F', 'TT']],
				['TT', [Production.EMPTY]],
				['F', ['(', 'E', ')']],
				['F', ['id']]
			])
		},

		// {}
		// {KEY:VALUE,}
		// {KEY:{KEY:VALUE,},KEY:VALUE,}
		sample3: function () {
			return new ProductionCollection([
				['value', ['VALUE']],
				['value', ['object']],
				['object', ['{', 'members', '}']], // <- root
				['member', ['KEY', ':', 'value', ',']],
				['members'],
				['members', ['member', 'members']]
			])
		}
	}

})