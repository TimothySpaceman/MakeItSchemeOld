
export class Line {
    constructor(line) {
        this.type = line.split(" ")[0]      

        if (["Вводимо", "Виводимо"].includes(this.type)) {
            this.text = line
        } else {
            this.text = line.split(" ").slice(1).join(" ")
        }
    }
}
