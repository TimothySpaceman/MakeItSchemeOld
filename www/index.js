const mainArea = document.querySelector("#mainArea")
const lineNumbers = document.querySelector("#lineNumbers")
const textEditor = document.querySelector("#textEditor")
let text = textEditor.value
let tree = []
let lines = []
let treeStats = {
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

//| 0-Searching Condition | 1-Searching Yes | 2-Packing Yes | 3-Searching No | 4-Packing No | 5-Success |

// Enum
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
            if((treeStats.start == 1 || types[getLineType(line)] == "start") && treeStats.finish == 0){
                tree[lastElement] = {
                    type: types[getLineType(line)],
                    id: lastElement,
                    line: index+1,
                    text: getLineData(line),
                    actions: "none",
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

function checkChild(){
    tree.forEach((object)=>{
        console.log("ID: " + object.id + " Child: " + object.child)
    })
}

function clearChild(){
    tree.forEach((object)=>{
        object.child.splice(0, object.child.length)
    })
}

function processChild(){
    let condition = []
    let yesEnd = []
    let dots = 0
    let status = []
        
    for (let i = 0; i < tree.length; i++){
        if(tree[i].type == types["Умова"]){
            condition.push(i)
            status.push(statuses["FIND_YES"])
        }
        else if(tree[i].type == types["Так:"] && status[status.length-1] == statuses["FIND_YES"]){
            dots++
            tree[condition[condition.length-1]].child[0] = i
            status[status.length-1] = statuses["PACK_YES"]
            tree[i].child[0] = i+1
        }
        else if(tree[i].type == types["Ні:"] && status[status.length-1] == statuses["FIND_NO"]){
            dots++
            tree[condition[condition.length-1]].child[1] = i
            status[status.length-1] = statuses["PACK_NO"]
            tree[i].child[0] = i+1
        }
        else if(tree[i].type == types["..."]){
            dots--
            if(status[status.length-1] == statuses["PACK_YES"]){
                status[status.length-1] = statuses["FIND_NO"]
                yesEnd.push(i)
            }
            else if(status[status.length-1] == statuses["PACK_NO"]){
                status.splice(status.length-1, 1)
                tree[i].child[0] = i+1
                tree[yesEnd[yesEnd.length - 1]].child[0] = i+1
                yesEnd.splice(yesEnd.length-1, 1)
                condition.splice(condition.length-1, 1)
            }
        }
        else {
            tree[i].child[0] = i+1
        }
    }
    
}

function clearService(){
    for (let i = 0; i < tree.length - 1; i++){
        for(let childInd = 0; childInd < tree[i].child.length; childInd++){
            if(tree[tree[i].child[childInd]].type == types["Так:"] || tree[tree[i].child[childInd]].type == types["Ні:"] || tree[tree[i].child[childInd]].type == types["..."]){
                tree[i].child[childInd] = tree[tree[i].child[childInd]].child[0]
                break;
            }
        }
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
    clearChild()
    processChild()
}