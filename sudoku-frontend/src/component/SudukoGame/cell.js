export default class Cell {
    constructor(row, col, value) {
        this.value = value || 0;
        this.row = row;
        this.col = col;
        if (value === ".") {
            this.value = 0;
        } else {
            this.value = parseInt(value, 10);
        }

        this.possibleValues = [];
    }

    toString() {
        return this.value || ".";
    }
}