// const mainArea = document.querySelector("#mainArea");
// const lineNumbers = document.querySelector("#lineNumbers");
// const textEditor = document.querySelector("#textEditor");
// let text = textEditor.value;
// let tree = Array(1);
// let lines = Array(1);

// const types = {
//     "Початок": "start",
//     "Кінець": "finish",
//     "Вводимо": "input",
//     "Виводимо": "output",
//     "Виконуємо": "action",
//     "Умова": "condition",
//     "Так:": "yes",
//     "Ні:": "no",
//     "...": "end",
//     "Порожньо": "nothingness"
// }

// function init(){
//     tree[0] = "none";
//     lines[0] = "none";
// }

// init();

// function updateEditor(){
//     //debugger
//     text = textEditor.value;
//     lineNumbers.innerHTML ="";

//     let mainAreaHeight = ((textEditor.clientHeight-5)/23.75).toFixed(0);
//     for(let i=1;i<=mainAreaHeight;i++){
//         lineNumbers.innerHTML += i+"<br>";
//     }

//     textEditor.style.height = "1px";
//     textEditor.style.height = (textEditor.scrollHeight)+"px";

//     //console.log(text);
// }

// function getLineType(line){
//     return line.split(/ /)[0];
// }

// function getLineData(line){
//     let lineParts = line.split(/ /).slice(1);
//     return lineParts.join(" ");
// }

// function parseText(){
//     if(text != "" ) {
//         lines = text.split(/\r?\n/);
//     }
// }

// function growTree(){
//     let lastElement = 0;
//     lines.forEach((line, index) => {
//         if(line != "" && (types[getLineType(line)] ?? false)){
//             tree[lastElement] = {
//                 type: types[getLineType(line)],
//                 line: index,
//                 text: getLineData(line),
//                 actions: "none"
//             };
//             lastElement++;
//         }
//     })
// }

// function processConditions(index){
//     let i = index;
//     let condIndex = index;
//     const checkFinish = tree[i].type != types["Кінець"];
//     const checkProcessed = tree[i].actions != "none";
//     let status = 0; //| 0-Searching Condition | 1-Searching Yes | 2-Packing Yes | 3-Searching No | 4-Packing No | 5-Success |

//     //Searching condition
//     if(status == 0){
//         while(tree[i].type != types["Умова"] && checkFinish){
//             i++;
//             if(i>=tree.length  !checkFinish){
//                 return console.log("Error: Condition Not Found");
//             }
//         }
//         if(!checkProcessed){
//             condIndex = i;
//             status = 1;
//         }
//         else {
//             processConditions(i+1);
//             return;
//         }
//     }

//     //Searching YES
//     if(status == 1){
//         while(tree[i].type != types["Так:"] && checkFinish){
//             i++;
//             if(i >= tree.length  !checkFinish){
//                 return console.log("Error: Branch TRUE not found! Condition line: " + (tree[condIndex].line+1));
//             }
//         }
//         tree[condIndex].actions = new Object;
//         tree[condIndex].actions.yes = Array(0);
//         //tree[condIndex].actions.yes[0] = new Object({type: types["Порожньо"]});
//         tree.splice(i, 1);
//         status = 2;
//     }

//     console.log(tree[condIndex].actions.yes);
//     //Packing YES
//     if(status == 2){
//         while(tree[i].type != types["..."] && checkFinish){
//             if(tree[i].type == types["Умова"]){
//                 processConditions(i);
//                 i++;
//             }
//             else{
//                 tree[condIndex].actions.yes[tree[condIndex].actions.yes.length + 1] = tree[i];
//                 tree.splice(i, 1);
//             }
//             if(i >= tree.length  !checkFinish){
//                 return console.log("Error: Branch TRUE not completed correctly! Condition line: " + (tree[condIndex].line+1));
//             }
//         }
//         if(tree[i].type == types["..."]){
//             tree[condIndex].actions.yes += tree[i];
//             tree.splice(i, 1);
//         }
//         status = 3;
//     }

//     //Searching NO
//     if(status == 3){
//         while(tree[i].type != types["Ні:"] && checkFinish){
//             i++;
//             if(i >= tree.length  !checkFinish){
//                 return console.log("Error: Branch FALSE not found! Condition line: " + (tree[condIndex].line+1));
//             }
//         }
//         tree[condIndex].actions.no = Array(1);
//         tree[condIndex].actions.no[0] = {type: types["Порожньо"]};
//         tree.splice(i, 1);
//         status = 4;
//     }

//     //Packing NO
//     if(status == 4){
//         while(tree[i].type != types["..."] && checkFinish){
//             if(tree[i].type == types["Умова"]){
//                 processConditions(i);
//                 i++;
//             }
//             else{
//                 tree[condIndex].actions.no += tree[i];
//                 tree.splice(i, 1);
//             }

//             if(i >= tree.length || !checkFinish){
//                 return console.log("Error: Branch FALSE not completed correctly! Condition line: " + (tree[condIndex].line+1));
//             }
//         }
//         if(tree[i].type == types["..."]){
//             tree[condIndex].actions.no += tree[i];
//             tree.splice(i, 1);
//         }
//         status = 5;
//     }

//     if(status == 5){
//         return console.log("Successfully processed condition in line: " + (tree[condIndex].line+1));;
//     }
// }

// window.addEventListener("keyup", updateEditor);
// window.addEventListener("keydown", updateEditor);
// window.addEventListener("mousemove", updateEditor);

// function mainLoop(){
//     updateEditor();

//     requestAnimationFrame(mainLoop);
// }

// //mainLoop();

// function goo(){
//     parseText();
//     growTree();
// }

// /////////
// if(tree[i].type == types["Умова"]){
//             if(condition == -1 && tree[i].child.length==0){
//                 condition = i    
//                 status = statuses["FIND_YES"]
//             }
//             i++
//             previous = i-1
//         }
//         else if(tree[i].type == types["Так:"] && status == statuses["FIND_YES"]){
//             i++
//             dots++
//             previous = condition
//             subCondition = false

//             while(true){
//                 if(tree[i].type == types["Так:"] || tree[i].type == types["Ні:"]){
//                     dots++
//                 }
//                 else if(tree[i].type == types["..."]){
//                     dots--
//                     if(dots == 0){
//                         yesLast = previous
//                         i++
//                         status = statuses["FIND_NO"]
//                         break
//                     }
//                 }
//                 else if(subCondition == false){
//                     if(tree[i].type == types["Умова"]){
//                         subCondition = true
//                         tree[previous].child.push(i)
//                     }
//                     previous = i
//                 }
//                 i++
//             }
//         }
//         else if(tree[i].type == types["Ні:"] && status == statuses["FIND_NO"]){
//             i++
//             dots++
//             previous = condition
//             subCondition = false

//             while(true){
//                 if(tree[i].type == types["Так:"] || tree[i].type == types["Ні:"]){
//                     dots++
//                 }
//                 else if(tree[i].type == types["..."]){
//                     dots--
//                     if(dots == 0){
//                         noLast = previous
//                         if(yesLast == condition){
//                             tree[condition].child[0] = i+1
//                         }
//                         else if(tree[yesLast].type != types["Умова"]){
//                             tree[yesLast].child.push(i+1)
//                         }
//                         if(noLast == condition){
//                             tree[condition].child[1] = i+1
//                         }
//                         else {
//                             tree[noLast].child.push(i+1)
//                         }
//                         i++
//                         condition = -1
//                         subCondition = false
//                         previous = -1
//                         yesLast = -1
//                         noLast = -1
//                         status = statuses["DEFAULT"]
//                         break
//                     }
//                 }
//                 else if(subCondition == false){
//                     if(tree[i].type == types["Умова"]){
//                         subCondition = true
//                         tree[previous].child.push(i)
//                     }
//                     previous = i
//                 }
//                 i++
//             }
            
//         }
//         else {
//             if(tree[i].type != types["Так:"] && tree[i].type != types["Ні:"] && tree[i].child.length == 0) {
//                 tree[i].child.push(i+1)
//             }
//             i++
//         }
function processChild() {
    let condition = []
    let yesEnd = []
    let dots = 0
    let status = []
        
    for (let i = 0; i < tree.length; i++) {
        if (tree[i].type == types["Умова"]) {
            condition.push(i)
            status.push(statuses["FIND_YES"])
        } else if (tree[i].type == types["Так:"] && status[status.length-1] == statuses["FIND_YES"]) {
            dots++
            tree[condition[condition.length-1]].child[0] = i
            status[status.length-1] = statuses["PACK_YES"]
            tree[i].child[0] = i+1
        } else if (tree[i].type == types["Ні:"] && status[status.length-1] == statuses["FIND_NO"]) {
            dots++
            tree[condition[condition.length-1]].child[1] = i
            status[status.length-1] = statuses["PACK_NO"]
            tree[i].child[0] = i+1
        } else if (tree[i].type == types["..."]) {
            dots--
            if (status[status.length-1] == statuses["PACK_YES"]) {
                status[status.length-1] = statuses["FIND_NO"]
                yesEnd.push(i)
            } else if (status[status.length-1] == statuses["PACK_NO"]) {
                status.splice(status.length-1, 1)
                tree[i].child[0] = i+1
                tree[yesEnd[yesEnd.length - 1]].child[0] = i+1
                yesEnd.splice(yesEnd.length-1, 1)
                condition.splice(condition.length-1, 1)
            }
        } else {
            tree[i].child[0] = i+1
        }
    }
    
}

function clearService() {
    for (let i = 0; i < tree.length - 1; i++) {
        for (let childInd = 0; childInd < tree[i].child.length; childInd++) {
            if (tree[tree[i].child[childInd]].type == types["Так:"] || tree[tree[i].child[childInd]].type == types["Ні:"] || tree[tree[i].child[childInd]].type == types["..."]) {
                tree[i].child[childInd] = tree[tree[i].child[childInd]].child[0]
                break;
            }
        }
    }
}