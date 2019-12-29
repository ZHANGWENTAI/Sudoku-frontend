import Cell from "./cell";

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
        temp.push(".");
    }
    return temp.join("");
})();

class SudokuGrid {
    constructor(input = EMPTY) {
        let currentRow;
        this.rows = [];

        for (let idx = 0; idx < input.length; idx++) {
            if (idx % 9 === 0) {
                currentRow = [];
                this.rows.push(currentRow);
            }

            currentRow.push(
                new Cell(this.rows.length - 1, currentRow.length, input[idx])
            );
        }
    }

    toString() {
        let output = "";
        for (let i = 0; i < this.rows.length; i++) {
            if (i !== 0 && i % 3 === 0) {
                output += "---------+---------+---------\n";
            }

            let currentRow = this.rows[i];
            for (let j = 0; j < currentRow.length; j++) {
                if (j !== 0 && j % 3 === 0) {
                    output += "|";
                }

                output += " " + currentRow[j].toString() + " ";
            }

            output += "\n";
        }

        return output;
    }

    subgrids() {
        if (!this.grids) {
            this.grids = [];
            for (let i = 0; i < 9; i += 3) {
                for (let j = 0; j < 9; j += 3) {
                    this.grids.push(this.sameSubGridAs(new Cell(i, j)));
                }
            }
        }

        return this.grids;
    }

    columns() {
        if (!this._columns) {
            this._columns = [];
            for (let i = 0; i < 9; i++) {
                this._columns.push([]);
            }
            this.rows.forEach(function(row) {
                row.forEach(function(cell, idx) {
                    this._columns[idx].push(cell);
                }, this);
            }, this);
        }

        return this._columns;
    }

    sameRowAs(cell) {
        return this.rows[cell.row];
    }

    sameColAs(cell) {
        return this.columns()[cell.col];
    }

    sameSubGridAs(cell) {
        /*
            Get all the cells in the same "sub grid" as the given cell. e.g.
            for the cell "c" below the cells in the "same_sub_grid" (which are
            marked x below) are returned along with the argument cell.
            x x x | . . . | . . .
            x c x | . . . | . . .
            x x x | . . . | . . .
            ------+-------+------
            . . . | . . . | . . .
            . . . | . . . | . . .
            . . . | . . . | . . .
            ------+-------+------
            . . . | . . . | . . .
            . . . | . . . | . . .
            . . . | . . . | . . .
        */

        // row:
        // 0 - 2 -> 0
        // 3 - 5 -> 3
        // 6 - 8 -> 5

        // col:
        // same as above
        if (!cell.subgrid) {
            let index = function(x) {
                if (x <= 2) {
                    return 0;
                } else if (x <= 5) {
                    return 3;
                } else {
                    return 6;
                }
            };

            let startRow = index(cell.row),
                startCol = index(cell.col),
                subgrid = [];
            for (let i = startRow; i < startRow + 3; i++) {
                let row = this.rows[i],
                    subGridRow = [];
                for (let j = startCol; j < startCol + 3; j++) {
                    subGridRow.push(row[j]);
                }

                subgrid.push(subGridRow);
            }
            cell.subgrid = subgrid;
        }

        return cell.subgrid;
    }

    unsolved() {
        return this.rows.flatten().filter(c => c.value === 0);
    }

    isSolved() {
        return !this.rows.flatten().some(x => x.value === 0);
    }

    peers(cell) {
        /*
            Get the peers for the cell.  The peers for the cell "c" are pictorially
            represented below by the cells marked "x"
            x x x | . . . | . . .
            x c x | x x x | x x x
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
        if (!cell.peers) {
            cell.peers = Array.from(
                new Set(
                    this.sameColAs(cell)
                        .concat(this.sameRowAs(cell))
                        .concat(this.sameSubGridAs(cell).flatten())
                        .filter(x => x !== cell)
                )
            );
        }

        return cell.peers;
    }

    toFlatString() {
        return this.rows
            .flatten()
            .map(x => x.toString())
            .join("");
    }
}

export default SudokuGrid