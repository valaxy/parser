import Rule from './rule'

export default class TestNot extends Rule {

    constructor(private _rule:Rule) {
        super()
    }


    parse({text, pos, setPos}):boolean {
        let p = pos
        if (!this._rule.parse.apply(this._rule, arguments)) {
            return true
        } else {
            setPos(p)
            return false
        }
    }

}