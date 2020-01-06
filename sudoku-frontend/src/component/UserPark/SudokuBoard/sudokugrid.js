/*
    [[1, 2, 3], [4, 5, 6]].flatten()
    [1, 2, 3, 4, 5, 6]
*/
//eslint-disable-next-line
Array.prototype.flatten = function() {
    return [].concat.apply([], this);
};

const EMPTY = (() => {
    let temp = [];
    for (let i = 0; i < 81; i++) {
        temp.push("0");
    }
    return temp.join("");
})();

class SudokuGrid {
    constructor(input= EMPTY) {
        let seq = '0'+ input
        this.rows = [];
        this.columns = [];
        this.subgrids = [];

        // turn input into this.rows
        let temprow = [];
        for (let i = 1; i <= input.length; i++) {
            temprow.push(parseInt(seq[i], 10))
            if (i % 9 === 0) {
                this.rows.push(temprow);
                temprow = []
            }  
        }

        //turn input into this.columns
        let tempcol = []
        for (let i = 1; i <= 9; i++) {
            for(let j = i; j <= input.length; j += 9) {
                tempcol.push(parseInt(seq[j], 10))
            }
            this.columns.push(tempcol)
            tempcol = []
        }
    }

    //turn input into this.subgrids
    initSubGrid() {
        let tempsub = []
        for (let i = 1; i <= 9; i++) {
            this.subgrids.push(tempsub)
        }   
        for(let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.subgrids[(i%3) * 3 + j%3].push(this.rows[i][j])
            }
        }
    }

    rowOf(rowIdx) {
        return new Set(this.rows[rowIdx]);
    }

    columnOf(colIdx) {
        return new Set(this.columns[colIdx]);
    }

    subGridOf(subIdx) {
        return new Set(this.subgrids[subIdx])
    }

    check() {
        /*
            Get the peers for the cell.  The peers for the cell "c" are pictorially
            represented below by the cells marked "x"
            x x x | . . . | . . .
            x x x | x x x | x x x
            x x x | . . . | . . .
            ------+-------+------
            . x . | . . . | . . .
            . x . | . . . | . . .
            . x . | . . . | . . .
            ------+-------+------
            . x . | . . . | . . .
            . x . | . . . | . . .
            . x . | . . . | . . .
        */
       let ifRight = true
       this.initSubGrid()
       for (let i = 0; i < 9; i++) {
           for(let j = 1; j <= 9; j++){
                ifRight = ifRight && 
                            this.rowOf(i).has(j) && 
                            this.coilumnOf(i).has(j) && 
                            this.subGridOf(i).has(j);
           }
       }
       return ifRight
    }

    toFlatString() {
        return this.rows.flatten()
                        .map(x => x.toString())
                        .join("");
    }
}

export default SudokuGrid