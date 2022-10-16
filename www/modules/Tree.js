
import { Node } from "./Node.js"
import { Line } from "./Line.js"

import { statuses, directions, types } from "./mappings.js"

export class Tree {
    constructor() {
        this.snapshot = []
        this.snapshotIndex = -1
    }

    grow() {
        this.elements = []
        this.initStats()
        this.createSnapshot()
        this.parseText()

        this.snapshot[this.snapshotIndex].forEach((line, index) => {
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
        this.snapshot[this.snapshotIndex].value.split(/\r?\n/).forEach((line) => {
            this.snapshot[this.snapshotIndex].push(new Line(line.trim()))
        })
        textEditor.innerHTML = this.snapshot[this.snapshotIndex]
    }

    createSnapshot() {
        this.snapshot.push(textEditor.value)
        this.snapshotIndex = this.snapshot.length - 1
    }

    changeSnapshot(direction) {
        if (direction === directions.UP && this.snapshotIndex < this.snapshot.length - 2) {
            this.snapshotIndex += 1
        } else if (direction === directions.DOWN && this.snapshotIndex > 0) {
            this.snapshotIndex -= 1
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
            } else if (this.elements[i].type == types["Так:"] && status[status.length - 1] == statuses["FIND_YES"]) {
                dots += 1

                this.elements[condition[condition.length - 1]].child[0] = i

                status[status.length - 1] = statuses["PACK_YES"]
                this.elements[i].child[0] = i + 1
            } else if (this.elements[i].type == types["Ні:"] && status[status.length - 1] == statuses["FIND_NO"]) {
                dots += 1

                this.elements[condition[condition.length - 1]].child[1] = i

                status[status.length - 1] = statuses["PACK_NO"]
                this.elements[i].child[0] = i + 1
            } else if (this.elements[i].type == types["..."]) {
                dots -= 1

                if (status[status.length - 1] == statuses["PACK_YES"]) {
                    status[status.length - 1] = statuses["FIND_NO"]
                    yesEnd.push(i)
                } else if (status[status.length - 1] == statuses["PACK_NO"]) {
                    status.splice(status.length - 1, 1)

                    this.elements[i].child[0] = i + 1
                    this.elements[yesEnd[yesEnd.length - 1]].child[0] = i + 1

                    yesEnd.splice(yesEnd.length - 1, 1)
                    condition.splice(condition.length - 1, 1)
                }
            } else {
                this.elements[i].child[0] = i + 1
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
