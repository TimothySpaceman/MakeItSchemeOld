const mainArea = document.querySelector("#mainArea")
const lineNumbers = document.querySelector("#lineNumbers")
const textEditor = document.querySelector("#textEditor")

import { Tree, mappings } from "./modules/index.js"

let isCtrlPressed = 0

// телегу глянь

function updateEditor() {
    lineNumbers.innerHTML =""

    let mainAreaHeight = ((textEditor.clientHeight - 5) / 23.75).toFixed(0)

    for (let i = 1; i <= mainAreaHeight; i += 1) {
        lineNumbers.innerHTML += `${i}<br>`
    }

    textEditor.style.height = "1px"
    textEditor.style.height = `${textEditor.scrollHeight}px`
}

["keyup", "keydown", "mousemove"].forEach((el) => {
    window.addEventListener(el, updateEditor)
})

window.addEventListener("keydown", (event) => {
    if (event.keyCode == mappings.keyCodes.ctrl) {    
        isCtrlPressed = 1
    }

    if (isCtrlPressed && event.keyCode == mappings.keyCodes.z) {    
        if (isCtrlPressed == 1) {
            try {
                tree.changeSnapshot(directions.DOWN)
            } catch {}
        }
    }

    if (isCtrlPressed && event.keyCode == mappings.keyCodes.y) {    
        if (isCtrlPressed == 1) {
            tree.changeSnapshot(directions.UP)
        }
    }

    if (isCtrlPressed == 0) {
        tree.createSnapshot()
    }
}) 

window.addEventListener("keyup", (event) => {
    if (event.keyCode == mappings.keyCodes.ctrl) {    
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
