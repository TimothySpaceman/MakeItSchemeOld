const mainArea = document.querySelector("#mainArea")
const lineNumbers = document.querySelector("#lineNumbers")
const textEditor = document.querySelector("#textEditor")
let text = textEditor.value
let tree = []
let lines = []

const statuses = {
    DEFAULT: 0,
    FIND_YES: 1,
    FIND_NO: 2,
    PACK_YES: 3,
    PACK_NO: 4
}

const types = {
    "Початок": "start",
    "Кінець": "finish",
    "Вводимо": "input",
    "Виводимо": "output",
    "Виконуємо": "action",
    "Умова": "condition",
    "Так:": "yes",
    "Ні:": "no",
    "...": "end",

    includes: function() {
        Array.from(arguments).forEach(prop => {
            if (Object.getOwnPropertyNames(this).includes(prop)) {
                return true
            }
        })
    }
}


class Tree {
    constructor() {
        this.elements = []
        this.lines = []
        this.stats = {}

        Object.values(types).filter(el => typeof(el) === "string").forEach(stat => {
            this.stats[stat] = 0
        })
    }

    grow() {
        //this.elements = []
        //this.stats = {}
        this.lines.forEach((line, index) => {
            if (line && types[line.type]) {
                if ((this.stats.start == 1 || types[line.type] == "start") && this.stats.finish == 0) {
                    this.elements.push(new Node({
                        type: types[line.type],
                        id: this.elements.length,
                        line: index + 1,
                        text: line.text,
                        child: []
                    }))

                    this.stats[types[line.type]]++
                }
            }
        })
    }

    clearChild() {
        this.elements.forEach(el => el.clearChild())
    }

    processChild() {
        let condition = []
        let yesEnd = []
        let dots = 0
        let status = []

        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].type == types["Умова"]) {
                condition.push(i)
                status.push(statuses["FIND_YES"])
            } else if (this.elements[i].type == types["Так:"] && status[status.length-1] == statuses["FIND_YES"]) {
                dots++

                this.elements[condition[condition.length-1]].child[0] = i

                status[status.length-1] = statuses["PACK_YES"]
                this.elements[i].child[0] = i+1
            } else if (this.elements[i].type == types["Ні:"] && status[status.length-1] == statuses["FIND_NO"]) {
                dots++

                this.elements[condition[condition.length-1]].child[1] = i

                status[status.length-1] = statuses["PACK_NO"]
                this.elements[i].child[0] = i+1
            } else if (this.elements[i].type == types["..."]) {
                dots--

                if (status[status.length-1] == statuses["PACK_YES"]) {
                    status[status.length-1] = statuses["FIND_NO"]
                    yesEnd.push(i)
                } else if (status[status.length-1] == statuses["PACK_NO"]) {
                    status.splice(status.length-1, 1)

                    this.elements[i].child[0] = i+1
                    this.elements[yesEnd[yesEnd.length - 1]].child[0] = i+1

                    yesEnd.splice(yesEnd.length-1, 1)
                    condition.splice(condition.length-1, 1)
                }
            } else {
                this.elements[i].child[0] = i+1
            }
        }

        for (let i = 0; i < this.stats.end; i++) {
            this.clearService()
        }
    }

    clearService() {
        for (let i = 0; i < this.elements.length - 1; i++) {
            for (let childInd = 0; childInd < this.elements[i].child.length; childInd++) {
                if (["yes", "no", "end"].includes(tree.elements[tree.elements[i].child[childInd]].type)) {
                //if(tree.elements[tree.elements[i].child[childInd]].type == types["Так:"] || tree.elements[tree.elements[i].child[childInd]].type == types["Ні:"] || tree.elements[tree.elements[i].child[childInd]].type == types["..."]){
                    console.log("ID: " + this.elements[i].id + " Child " + childInd)
                    this.elements[i].child[childInd] = this.elements[this.elements[i].child[childInd]].child[0]
                    break
                }
            }
        }
    }

    checkChild() {
        this.elements.forEach((object) => {
            console.log("ID: " + object.id + " Child: " + object.child)
        })
    }
}

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

class Line {
    constructor(line) {
        this.type = line.split(" ")[0]      

        if (["Вводимо", "Виводимо"].includes(this.type)) {
            this.text = line
        } else {
            this.text = line.split(" ").slice(1).join(" ")
        }
    }
}

function init() {
    tree = new Tree()
}

init()

function updateEditor() {
    //debugger
    text = textEditor.value
    lineNumbers.innerHTML =""

    let mainAreaHeight = ((textEditor.clientHeight-5)/23.75).toFixed(0)

    for (let i=1;i<=mainAreaHeight;i++) {
        lineNumbers.innerHTML += i+"<br>"
    }

    textEditor.style.height = "1px"
    textEditor.style.height = (textEditor.scrollHeight)+"px"

    //console.log(text)
}

function parseText() {
    tree.lines = []
    text.split(/\r?\n/).forEach((line) => {
        tree.lines.push(new Line(line.trim()))
    })
}

["keyup", "keydown", "mousemove"].forEach((el) => {
    window.addEventListener(el, updateEditor)
})

function mainLoop() {
    updateEditor()
    requestAnimationFrame(mainLoop)
}

//mainLoop()

function goo() {
    init()
    parseText()
    console.log(tree.lines)
    console.log(tree.elements)
    tree.grow()
    console.log(tree.lines)
    console.log(tree.elements)
    tree.clearChild()
    tree.processChild()
}