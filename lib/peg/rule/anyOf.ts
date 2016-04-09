import Rule from "./rule"

export default class AnyOf extends Rule {
    constructor(private _chars:string) {
        super()
    }

    parse({text, pos, setPos}) {
        if (pos >= text.length) return false
        if (this._chars.indexOf(text[pos]) < 0) return false

        setPos(pos + 1)
        return true
    }
}