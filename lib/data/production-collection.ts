import _ = require('underscore')
import Production from './production'

class ProductionCollection {
    constructor(rawProductions = []) {
        this._p = {}  // production save in map
        this._p2 = [] // production save in array
        this._nonTerminals = {}

        rawProductions.forEach((raw) => {
            this.add(new Production(raw[0], raw[1]))
        })
    }

    add(production) {
        if (!(production.head() in this._p)) {
            this._p[production.head()] = []
        }
        this._p2.push(production)
        this._p[production.head()].push(production)
        this._nonTerminals[production.head()] = true
    }

    /** 终结符 */
    isTerminal(symbol) {
        return !this.isNonTerminal(symbol)
    }

    /** 非终结符 */
    isNonTerminal(symbol) {
        return symbol in this._nonTerminals
    }

    getNonTerminals() {
        return _.keys(this._nonTerminals)
    }

    /** Return Productions */
    getProductionsBySymbol(symbol) {
        if (symbol in this._p) {
            return _.clone(this._p[symbol])
        } else {
            return []
        }
    }

    getProductionAt(index) {
        return this._p2[index]
    }

    eachProduction(cb) {
        for (var head in this._p) {
            for (var production of this._p[head]) {
                cb(production)
            }
        }
    }
}

export default ProductionCollection
