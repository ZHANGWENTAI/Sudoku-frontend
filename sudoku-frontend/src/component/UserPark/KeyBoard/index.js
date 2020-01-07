import React, {Component} from 'react';
import { Icon } from 'semantic-ui-react'

// the soft keyboard used to fill in SudokuBoard
class KeyBoard extends Component {
  render() {
    const number = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']];
    return (
      <table>
        <tbody>
          {number.map(row => {
            return (
              <tr>
                {row.map(val => {
                  return (
                    <button class="KeyBoard" onClick={() => this.props.handleKeyClick(val)}>
                      {val}
                    </button>
                  )
                })}
              </tr>
            )
          })}
          <tr>
          <button class="KeyBoard" onClick={() => this.props.handleKeyClick(0)}>
            <Icon name='eraser' size='small' />
          </button>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default KeyBoard;

  