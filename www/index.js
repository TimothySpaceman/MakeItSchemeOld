const mainArea = document.querySelector("#mainArea")
const lineNumbers = document.querySelector("#lineNumbers")
const textEditor = document.querySelector("#textEditor")
let text = textEditor.value
let tree = []
let lines = []

//| 0-Searching Condition | 1-Searching Yes | 2-Packing Yes | 3-Searching No | 4-Packing No | 5-Success |

// Enum
const statuses = {
    DEFAULT: 0,
    FIND_YES: 1,
    FIND_NO: 2,
    FIND_END: 3,
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
                id: lastElement,
                line: index+1,
                text: getLineData(line),
                actions: "none",
                child: []
            }

            lastElement++
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
    let condition = -1
    let subCondition = false
    let previous = -1
    let yesLast = -1
    let noLast = -1
    let dots = 0
    let status = statuses["DEFAULT"]
        
    for (let i = 0; i < tree.length; i=i){
        
        if(tree[i].type == types["Умова"]){
            if(condition == -1 && tree[i].child.length==0){
                condition = i    
                status = statuses["FIND_YES"]
            }
            i++
            previous = i-1
        }
        else if(tree[i].type == types["Так:"] && status == statuses["FIND_YES"]){
            i++
            dots++
            previous = condition
            subCondition = false

            while(true){
                if(tree[i].type == types["Так:"] || tree[i].type == types["Ні:"]){
                    dots++
                }
                else if(tree[i].type == types["..."]){
                    dots--
                    if(dots == 0){
                        yesLast = previous
                        i++
                        status = statuses["FIND_NO"]
                        break
                    }
                }
                else if(subCondition == false){
                    if(tree[i].type == types["Умова"]){
                        subCondition = true
                        tree[previous].child.push(i)
                    }
                    previous = i
                }
                i++
            }
        }
        else if(tree[i].type == types["Ні:"] && status == statuses["FIND_NO"]){
            i++
            dots++
            previous = condition
            subCondition = false

            while(true){
                if(tree[i].type == types["Так:"] || tree[i].type == types["Ні:"]){
                    dots++
                }
                else if(tree[i].type == types["..."]){
                    dots--
                    if(dots == 0){
                        noLast = previous
                        if(yesLast == condition){
                            tree[condition].child[0] = i+1
                        }
                        else if(tree[yesLast].type != types["Умова"]){
                            tree[yesLast].child.push(i+1)
                        }
                        if(noLast == condition){
                            tree[condition].child[1] = i+1
                        }
                        else {
                            tree[noLast].child.push(i+1)
                        }
                        i++
                        condition = -1
                        subCondition = false
                        previous = -1
                        yesLast = -1
                        noLast = -1
                        status = statuses["DEFAULT"]
                        break
                    }
                }
                else if(subCondition == false){
                    if(tree[i].type == types["Умова"]){
                        subCondition = true
                        tree[previous].child.push(i)
                    }
                    previous = i
                }
                i++
            }
            
        }
        else {
            if(tree[i].type != types["Так:"] && tree[i].type != types["Ні:"] && tree[i].child.length == 0) {
                tree[i].child.push(i+1)
            }
            i++
        }
    }

    // tree.forEach((object) => {
    //     object.child.splice(0, object.child.length);
    //     //console.log("Type: " + object.type + " id: " + object.id + " line: " + object.line)
    //     if(object.type == types["Умова"]){
    //         lastCondition++;
    //         conditions[lastCondition] = object.id;
    //     }
    //     else if(object.type == types["Так"]){
    //         if(tree[conditions[lastCondition]].child[])
    //     }
    // })
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