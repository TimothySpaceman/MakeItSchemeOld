
class Node {
    constructor({ type, line, id, text }) {
        this.type = type
        this.line = line
        this.id = id
        this.text = text

        this.child = []
    }

    clearChild() {
        this.child.splice(0, this.child.length)
    }
}
