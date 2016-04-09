/** 产生式 */
class Production {
    private _head
    private _body

    constructor(head, body = [Production.EMPTY]) {
        this._head = head
        this._body = body
    }

    // string
    head(head) {
        if (head == undefined) {
            return this._head
        } else {
            this._head = head
        }
    }

    // string array
    body(body) {
        if (body === undefined) {
            return this._body
        } else {
            this._body = body
        }
    }

    toJSON() {
        return [this._head, this._body]
    }
}

Production.EMPTY = "0"
Production.END   = "1"

export default Production