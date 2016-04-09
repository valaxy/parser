import Rule from "./rule"

export class Chunk extends Rule {
    constructor(private _str:string) {
        super()
    }

    parse({text, pos, setPos}) {
        if (pos + this._str.length > text.length) return false

        for (let i = 0; i < this._str.length; i++) {
            if (text[pos + i] != this._str[i]) {
                return false
            }
        }

        setPos(pos + this._str.length)
        return true
    }
}