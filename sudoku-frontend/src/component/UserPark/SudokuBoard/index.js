import React, { Component } from "react";
import SudokuGrid from "./sudokugrid"
import './index.css';
import 'semantic-ui-css/semantic.min.css';


class Square extends Component {
  render() {
    const value = this.props.value;
    const row = this.props.row;
    const column = this.props.col;

    return (
      <input
        type="text"
        value={value === 0 ? "" : value}
        readOnly={true}
        onClick={() => this.props.onCellChosen(row, column)}
      />
    );
  }
}

class SudokuBoard extends Component {
  render() {
    var grid = new SudokuGrid(this.props.puzzleContent);
    return (
      <table className="sudoku">
        <tbody>
          {grid.rows.map((row, ridx) => {
            return (
              <tr>
                {row.map((num, cidx) => (
                  <td>
                    <Square
                      value={num}
                      row={ridx}
                      col={cidx}
                      onCellChosen={this.props.onCellChosen}
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default SudokuBoard