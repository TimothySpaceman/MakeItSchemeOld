const mainArea = document.querySelector("#mainArea");
const lineNumbers = document.querySelector("#lineNumbers");
const textEditor = document.querySelector("#textEditor");
let text = textEditor.value;
let tree = Array(1);
let lines = Array(1);

function init(){
    tree[0] = "none";
    lines[0] = "none";
}

init();

function updateEditor(){
    //debugger
    text = textEditor.value;
    lineNumbers.innerHTML ="";

    let mainAreaHeight = ((textEditor.clientHeight-5)/23.75).toFixed(0);
    for(let i=1;i<=mainAreaHeight;i++){
        lineNumbers.innerHTML += i+"<br>";
    }

    textEditor.style.height = "1px";
    textEditor.style.height = (textEditor.scrollHeight)+"px";

    //console.log(text);
}

function parseText(){
    if(text != "" ) {
        lines = text.split(/\r?\n/);
    }
}

function growTree(){
    lines.forEach((line, index) => {
        if(line != ""){

        }
    })
}

window.addEventListener("keyup", updateEditor);
window.addEventListener("keydown", updateEditor);
window.addEventListener("mousemove", updateEditor);

function mainLoop(){
    updateEditor();

    requestAnimationFrame(mainLoop);
}

//mainLoop();