define(function (require) {
	var ProductionCollection = require('cjs!../dist/production-collection'),
	    Production           = require('cjs!../dist/production')


	return {
		// id
		// id+id
		// id+id+id+id
		sample1: function () {
			var pc = new ProductionCollection
			pc.add(new Production('E', ['T', 'F']))
			pc.add(new Production('T', ['id']))
			pc.add(new Production('F', ['+', 'E']))
			pc.add(new Production('F'))
			return pc
		}
	}

})