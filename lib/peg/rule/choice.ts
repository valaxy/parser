import Rule from "./rule"

export default class Choice extends Rule {
    private _rules:Rule[]

    constructor(...rules:Rule[]) {
        super()
        this._rules = rules
    }

    parse({text, pos, setPos}):boolean {
        for (var rule of this._rules) {
            if (rule.parse.apply(rule, arguments)) {
                return true
            }
        }
        return false
    }
}