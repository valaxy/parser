import Rule from "./rule"

export default class Test extends Rule {

    constructor(private _rule:Rule) {
        super()
    }


    parse({text, pos, setPos}) {
        let p = pos
        if (!this._rule.parse.apply(this._rule, arguments)) {
            return false
        } else {
            setPos(p)
            return true
        }
    }
}