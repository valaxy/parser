import Rule from "./rule"

export default class RangeOf extends Rule {

    constructor(private _charX:string, private _charY:string) {
        super()
        if (_charX > _charY) throw new Error('charX should <= charY')
    }

    parse({text, pos, setPos}) {
        if (pos >= text.length) throw new Error('error')
        let ch = text[0]
        if (ch < this._charX || ch > this._charY) throw new Error('rangeOf error')
        setPos(pos + 1)
    }
}