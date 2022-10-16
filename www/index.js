const mainArea = document.querySelector("#mainArea")
const lineNumbers = document.querySelector("#lineNumbers")
const textEditor = document.querySelector("#textEditor")

const statuses = {
    DEFAULT: 0,
    FIND_YES: 1,
    FIND_NO: 2,
    PACK_YES: 3,
    PACK_NO: 4
}

const keyCodes = {
    ctrl: 17,
    z: 90,
    y: 89
}

const directions = {
    UP: 1,
    DOWN: -1
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
// Кайфарик
// ИДИ НАХУЙ С МОЕЙ СТРОКИ пиши на своей, так вот, ну там не только с is, еще пару префиксов есть
// булевые нахуй переменные с is должны начинаься буду знать, спасибо
let isCtrlPressed = 0

class Tree {
    constructor() {
        this.story = []
        this.storyIndex = -1
    }

    grow() {
        this.elements = []
        this.initStats()
        this.createSnapshot()
        this.parseText()

        this.story[this.storyIndex].forEach((line, index) => {
            if (line && types[line.type]) {
                if ((this.stats.start == 1 || types[line.type] == "start") && this.stats.finish == 0) {
                    this.elements.push(new Node({
                        type: types[line.type],
                        id: this.elements.length,
                        line: index + 1,
                        text: line.text,
                        child: []
                    }))

                    this.stats[types[line.type]] += 1
                }
            }
        })
    }

    initStats() {
        this.stats = {}

        Object.values(types).filter(el => typeof(el) === "string").forEach(stat => {
            this.stats[stat] = 0
        })
    }

    parseText() {
        this.story[this.storyIndex].value.split(/\r?\n/).forEach((line) => {
            this.story[this.storyIndex].push(new Line(line.trim()))
        })
        textEditor.innerHTML = this.story[this.storyIndex]
    }

    createSnapshot() {
        this.story.push(textEditor.value)
        this.storyIndex = this.story.length - 1
    }

    changeSnapshot(direction) {
        if (direction === directions.UP && this.storyIndex < this.story.length - 2) {
            this.storyIndex += 1
        } else if (direction === directions.DOWN && this.storyIndex > 0) {
            this.storyIndex -= 1
        } else {
            throw 'Wrong snapshot direction'
        }

        this.grow()
    }

    clearChild() {
        this.elements.forEach(el => el.clearChild())
    }

    processChild() {
        let condition = []
        let yesEnd = []
        let dots = 0
        let status = []

        for (let i = 0; i < this.elements.length; i += 1) {
            if (this.elements[i].type == types["Умова"]) {
                condition.push(i)
                status.push(statuses["FIND_YES"])
            } else if (this.elements[i].type == types["Так:"] && status[status.length-1] == statuses["FIND_YES"]) {
                dots += 1

                this.elements[condition[condition.length-1]].child[0] = i

                status[status.length-1] = statuses["PACK_YES"]
                this.elements[i].child[0] = i+1
            } else if (this.elements[i].type == types["Ні:"] && status[status.length-1] == statuses["FIND_NO"]) {
                dots += 1

                this.elements[condition[condition.length-1]].child[1] = i

                status[status.length-1] = statuses["PACK_NO"]
                this.elements[i].child[0] = i+1
            } else if (this.elements[i].type == types["..."]) {
                dots -= 1

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

        for (let i = 0; i < this.stats.end; i += 1) {
            this.clearService()
        }
    }

    clearService() {
        for (let i = 0; i < this.elements.length - 1; i += 1) {
            for (let childInd = 0; childInd < this.elements[i].child.length; childInd += 1) {
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

function updateEditor() {
    //Оставь инкременты в покое уу сука
    lineNumbers.innerHTML =""

    let mainAreaHeight = ((textEditor.clientHeight-5)/23.75).toFixed(0)

    for (let i = 1; i <= mainAreaHeight; i += 1) {
        lineNumbers.innerHTML += i+"<br>"
    }

    textEditor.style.height = "1px"
    textEditor.style.height = (textEditor.scrollHeight)+"px"
}

["keyup", "keydown", "mousemove"].forEach((el) => {
    window.addEventListener(el, updateEditor)
})

window.addEventListener("keydown", (event) => {
    if (event.keyCode == keyCodes.ctrl) {    
        isCtrlPressed = 1
    }

    if (event.keyCode == keyCodes.z) {    
        if (isCtrlPressed == 1) {
            tree.changeSnapshot(directions.DOWN)
        }
    }

    if (event.keyCode == keyCodes.y) {    
        if (isCtrlPressed == 1) {
            tree.changeSnapshot(directions.UP)
        }
    }

    if (isCtrlPressed == 0) {
        tree.createSnapshot()
    }
}) 

window.addEventListener("keyup", (event) => {
    if (event.keyCode == keyCodes.ctrl) {    
        isCtrlPressed = 0
    }
}) 

function mainLoop() {
    updateEditor()
    requestAnimationFrame(mainLoop)
}

//mainLoop()

let tree = new Tree()

function goo() {
    tree.grow()
    tree.clearChild()
    tree.processChild()
}
