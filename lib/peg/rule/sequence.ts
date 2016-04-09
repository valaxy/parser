import Rule from './rule'

export default class Sequence extends Rule {
    private _rules

    constructor(...rules:Rule[]) {
        super()
        this._rules = rules
    }

    parse({text, pos, setPos, }):boolean {
        let p = pos
        for (let rule of this._rules) {
            if (!rule.parse.apply(this, arguments)) {
                setPos(p)
                return false
            }
        }
        return true
    }
}