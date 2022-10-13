const mainArea = document.querySelector("#mainArea")
const lineNumbers = document.querySelector("#lineNumbers")
const textEditor = document.querySelector("#textEditor")
let text = textEditor.value
let tree = []
let lines = []

//| 0-Searching Condition | 1-Searching Yes | 2-Packing Yes | 3-Searching No | 4-Packing No | 5-Success |

// Enum
const statuses = {
    SEARCHING_CONDITION: 0,
    SEARCHING_YES: 1,
    PACKING_YES: 2,
    SEARCHING_NO: 3,
    PACKING_NO: 4,
    SUCCESS: 5
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
    "Порожньо": "nothingness",

    includes: function(fields) {
        fields.forEach(el => {
            if (this[el]) return this[el]
        })

        return this["Порожньо"]
    }
}

function init(){
    tree[0] = "none"
    lines[0] = "none"
}

init()

function updateEditor(){
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

function getLineType(line){
    return line.split(/ /)[0]
}

function getLineData(line){
    let lineParts = line.split(/ /).slice(1)
    return lineParts.join(" ")
}

function parseText(){
    if (text != "" ) {
        lines = text.split(/\r?\n/)
    }
}

function growTree(){
    let lastElement = 0
    lines.forEach((line, index) => {
        if (line != "" && (types[getLineType(line)] ?? false)) {
            tree[lastElement] = {
                type: types[getLineType(line)],
                line: index,
                text: getLineData(line),
                actions: "none"
            }

            lastElement++
        }
    })
}

function processConditions(index, parent){
    let i = index
    let condIndex = index
    const checkFinish = tree.type != types["Кінець"]
    const checkProcessed = tree.actions != "none"
    let status = statuses.SEARCHING_CONDITION; //| 0-Searching Condition | 1-Searching Yes | 2-Packing Yes | 3-Searching No | 4-Packing No | 5-Success |
    let dotLevel = 0

    //Searching condition

    if (status == statuses.SEARCHING_CONDITION) {
        while (tree[i].type != types["Умова"] && checkFinish) {
            i++

            if (i>=tree.length || !checkFinish) {
                return console.log("Error: Condition Not Found")
            }
        }

        if (!checkProcessed) {
            condIndex = i
            status = statuses.SEARCHING_YES
        } else {
            //Почему ты считаешь что не сработает?
            processConditions(i+1, tree[i])
            return
        }
    }

    //Searching YES
    if (status == statuses.SEARCHING_YES) {
        while (tree[i].type != types["Так:"] && checkFinish) {
            i++

            if (i >= tree.length || !checkFinish) {
                return console.log("Error: Branch TRUE not found! Condition line: " + (tree[condIndex].line+1))
            }
        }

        tree[condIndex].actions = {
            yes: []
        }
        
        tree.splice(i, 1)
        status = statuses.PACKING_YES
        dotLevel++
    }

    
    //Packing YES
    if (status == statuses.PACKING_YES) {
        while (checkFinish) {
            if (tree[i].type == types.includes("Так:", "Ні:")) {
                dotLevel++
            } else if (tree[i].type == types["..."]) {
                if (dotLevel == 1) {
                    status = statuses.SEARCHING_NO
                    dotLevel--
                    parent.actions.yes.push(tree.splice(i, 1)[0])
                    break
                }

                dotLevel--
            }

            parent.actions.yes.push(tree.splice(i, 1)[0])

            if (i >= tree.length || !checkFinish) {
                return console.log("Error: Branch TRUE not completed correctly! Condition line: " + (tree[condIndex].line+1))
            }
        }
    }

    //Searching NO
    if (status == statuses.SEARCHING_NO) {
        while (tree[i].type != types["Ні:"] && checkFinish) {
            i++
            if (i >= tree.length || !checkFinish) {
                return console.log("Error: Branch FALSE not found! Condition line: " + (tree[condIndex].line+1))
            }
        }

        tree[condIndex].actions.no = []
        
        tree.splice(i, 1)
        status = statuses.PACKING_NO
        dotLevel++
    }

    //Packing NO
    if (status == statuses.PACKING_NO) {
        while (checkFinish) {
            if (tree[i].type == types.includes("Так:", "Ні:")) {
                dotLevel++
            } else if (tree[i].type == types["..."]) {
                if (dotLevel == 1) {
                    status = statuses.SUCCESS 
                    dotLevel--
                    parent.actions.yes.push(tree.splice(i, 1)[0])
                    break
                }
                dotLevel--
            }

            parent.actions.yes.push(tree.splice(i, 1)[0])
            
            if (i >= parent.length || !checkFinish) {
                return console.log("Error: Branch FALSE not completed correctly! Condition line: " + (parent[condIndex].line+1))
            }
        }
    }

    if (status == statuses.SUCCESS) {
        return console.log("Successfully processed condition in line: " + (parent[condIndex].line+1))
    }
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
}