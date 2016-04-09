abstract class Rule {
    abstract parse({text, pos, setPos}):boolean
}

export default Rule