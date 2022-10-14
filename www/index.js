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

//Сюда иди
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
    "Порожньо": "nothingness",

    includes: function() {
        arguments.forEach(prop => {
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

        this.stats = {
            start: 0,
            finish: 0,
            input: 0,
            output: 0,
            action: 0,
            condition: 0,
            yes: 0,
            no: 0,
            end: 0,
        }
    }

    grow() {
        lines.forEach((line, index) => {
            if (line && types[getLineType(line)]) {
                if ((this.stats.start == 1 || types[getLineType(line)] == "start") && this.stats.finish == 0) {
                    this.elements.push(new Node({
                        type: types[getLineType(line)],
                        id: lastElement,
                        line: index + 1,
                        text: getLineData(line),
                        child: []
                    }))

                    this.stats[types[getLineType(line)]]++
                }
            }
        })
    }

    clear() {
        this.elements.forEach(el => el.clear())
    }

    process() {
        let condition = []
        let yesEnd = []
        let dots = 0
        let status = []

        for (let i = 0; i < tree.length; i++) {
            if (this[i].type == types["Умова"]) {
                condition.push(i)
                status.push(statuses["FIND_YES"])
            } else if (this[i].type == types["Так:"] && status[status.length-1] == statuses["FIND_YES"]) {
                dots++
                this[condition[condition.length-1]].child[0] = i
                status[status.length-1] = statuses["PACK_YES"]
                this[i].child[0] = i+1
            } else if (this[i].type == types["Ні:"] && status[status.length-1] == statuses["FIND_NO"]) {
                dots++
                this[condition[condition.length-1]].child[1] = i
                status[status.length-1] = statuses["PACK_NO"]
                this[i].child[0] = i+1
            } else if (this[i].type == types["..."]) {
                dots--
                if (status[status.length-1] == statuses["PACK_YES"]) {
                    status[status.length-1] = statuses["FIND_NO"]
                    yesEnd.push(i)
                } else if (status[status.length-1] == statuses["PACK_NO"]) {
                    status.splice(status.length-1, 1)
                    this[i].child[0] = i+1
                    this[yesEnd[yesEnd.length - 1]].child[0] = i+1
                    yesEnd.splice(yesEnd.length-1, 1)
                    condition.splice(condition.length-1, 1)
                }
            } else {
                this[i].child[0] = i+1
            }
        }
    }

    clearService(tree) {
        for (let i = 0; i < tree.length - 1; i++) {
            for (let childInd = 0; childInd < this[i].child.length; childInd++) {
                if (types.includes("Так:", "Ні:", "...")) {
                    this[i].child[childInd] = this[this[i].child[childInd]].child[0]
                    break;
                }
            }
        }
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

    clear() {
        this.child.splice(0, this.child.length)
    }
}

class Line {
    constructor({line}) {
        this.type = line.split(" ")[0]
        
        if (types.includes("Вводимо", "Виводимо")) {
            this.text = line
        } else {
            this.text = line.split(" ").slice(1).join(" ")
        }
    }
}

function init() {
    tree = new Tree()
    lines = []
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

function getLineType(line) {
    return line.split(" ")[0]
}

function getLineData(line) {
    let lineParts = line.split(" ").slice(1)
    return lineParts.join(" ")
}

function parseText() {
    text.split(/\r?\n/).forEach((line) => {
        lines.push(new Line(line))
    })
    //Тут всё? ну да
    
    // Ща доделаешь еще глобальный массив lines переделывать будем, не, я то это делать умею, а тебе учиться надо
    //Ошаревший Но Годно Но по рукам в следующий раз дам
    //Я спать пойду так шо можешь себе качнуть репозиторий и развлекаться
    //Зачем его переделывать? надо. я обьяснял уже почему глобальные переменные плохо, поищи в телеге по поиску
    //Ты не осипчук чтоб так говорить
    //Ай Боже
    // да не, просто это в метод дерева захуярь, и внутри дерева уже массив lines будет
    //Создам класс текстедитор и будет там массив
    //Устроит?
    //Тоже варик, есть такое
}

function growTree() {
    let lastElement = 0
    lines.forEach((line, index) => {
        if (line != "" && (types[getLineType(line)] ?? false)) {
            if ((treeStats.start == 1 || types[getLineType(line)] == "start") && treeStats.finish == 0) {
                this[lastElement] = {
                    type: types[getLineType(line)],
                    id: lastElement,
                    line: index+1,
                    text: getLineData(line),
                    child: []
                }

                treeStats[types[getLineType(line)]]++
                
                lastElement++
            }
        }
    })
}

// lastCondition - індекс елементу масиву, де лежить айді умови, для якої шукаємо так і ні
// ConditionID [] - масив айді для умов

function checkChild() {
    tree.forEach((object)=>{
        console.log("ID: " + object.id + " Child: " + object.child)
    })
}

function clearChild() {
    tree.forEach((object)=>{
        object.child.splice(0, object.child.length)
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
    parseText()
    growTree()
    clearChild()
    processChild()
}