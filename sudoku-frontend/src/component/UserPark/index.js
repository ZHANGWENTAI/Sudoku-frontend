import React, {Component} from 'react'
import {Grid, Message, Container, Button} from 'semantic-ui-react'
import SudokuBoard from './SudokuBoard'
import SudokuGrid from './SudokuBoard/sudokugrid'
import Cookies from 'js-cookie'
import KeyBoard from './KeyBoard'
import UserCard from './UserCard'
import PuzzleAPI from "../../logic/PuzzleAPI"

class UserPark extends Component {
  constructor(props) {
    //initial 81 Zeros
    const initPuzzleContent = '000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    super(props);
    this.state = {
        error: '',
        puzzleContent: initPuzzleContent,
        pid: 0,
        activeRow: 0,
        activeColumn: 0,
    };
  }

  //generate pid and level according difficulty then send request to backend
  handleNewProblem(difficulty) {
    var that = this
    let gen = new Promise(function(resolve) {
      resolve({ pid: Math.floor(Math.random() * 100) + 1, level: 70 + difficulty + Math.floor(Math.random()*3)});
    });
    gen.then(function(PL){
      PuzzleAPI.pullnewproblem(PL.pid, PL.level).then(response => {
        response.json().then(data => {
          if (data.message === "Success") {
            that.setState({
              puzzleContent: data.data.content,
              pid: data.data.pid
            })
          } else {
            that.setState({error: data.message});
          }
        });
      });
    }) 
  }

  //if the answer is right, return true
  checkAnswer() {
    var answer = this.state.puzzleContent.split("")
    for(let i = 0; i < 9; i++) {
      let checkRow = {}
      let checkCol = {}
      let checkSub = {}
      for(let j = 0; j < 9; j++) {
        let num = answer[i*9 + j]
        if(checkRow[num] === true) return false
        checkRow[num] = true

        num = answer[i + 9*j]
        if(checkCol[num] === true) return false
        checkCol[num] = true

        num = answer[Math.floor(i/3)*27 + (i%3)*3 + Math.floor(j/3)*9 + (j%3)]
        if(checkSub[num] === true) return false
        checkSub[num] = true

        console.log(i, j, checkRow, checkCol, checkSub)
      }
    }
    console.log("bingo")
    return true
  }

  //check whether the board is fullfiled and whether the answer is right, finally submit
  handleSubmit() {
    var that = this
    if(this.state.puzzleContent.search('0') !== -1) {
      this.setState({
        error: "Please complete the table before submit"
      })
    }
    else {
      let uid = Cookies.get('uid')
      let authentication = Cookies.get('authentication')
      let pid = this.state.pid
      let passed = this.checkAnswer() ? 1 : 0
      console.log("passed: ", passed)
      PuzzleAPI.postsubmit(uid, authentication, pid, passed).then(response => {
        response.json().then(data => {
          if (data.message === "Success") {
            console.log(data.data)
            Cookies.set("submited", data.data.submited)
            Cookies.set("passed", data.data.passed)
            Cookies.set("score", data.data.score)
          } else {
            that.setState({
              error: data.message
            })
          }
        })
      })
    }
  }

  // update the state with the new puzzle string
  handleKeyClick(value) {
    var grid = new SudokuGrid(this.state.puzzleContent)
    grid.rows[this.state.activeRow][this.state.activeColumn] = value;
    this.setState({ 
      puzzleContent: grid.toFlatString(),
      error: ''
    });
  }

  // locate the input square
  onCellChosen(row, col) {
    this.setState({
      activeRow: row,
      activeColumn: col,
      error: ''
    });
  }

  render() {
    var message;
    if (this.state.error !== "") {
        message = (
            <Message size="big" negative>
                <Message.Header centered >Oops!</Message.Header>
                <p>{ this.state.error }</p>
            </Message>
        )
    }
    return (
      <Container style={{ marginTop: '3em' }}>
        {message}
        <Grid>
          <Grid.Row >
            <Grid.Column width={4}>
              <UserCard
                username={this.state.username}
                score={this.state.score}
                submited={this.state.submited}
                passed={this.state.passed}
                createdtime={this.state.createdtime}
              />
              {/* <GridRow>
                <TodoList/>
              </GridRow> */}
            </Grid.Column>
            <Grid.Column width={8}>
                <SudokuBoard
                  puzzleContent={this.state.puzzleContent}
                  onCellChosen={this.onCellChosen.bind(this)}
                />
            </Grid.Column>
            <Grid.Column width={4}>
              <KeyBoard
                handleKeyClick={this.handleKeyClick.bind(this)}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Button color='teal'  size='large' style={{marginRight: '15px'}} onClick={() => this.handleSubmit()}> Submit </Button>
            <Button.Group>
              <Button color='green' size='large' onClick={() => this.handleNewProblem(8)}> Easy </Button>
              <Button.Or />
              <Button color='yellow' size='large'  onClick={() => this.handleNewProblem(4)}> Medium </Button>
              <Button.Or />
              <Button color='red' size='large' onClick={() => this.handleNewProblem(0)}> Hard </Button>
            </Button.Group>
          </Grid.Row>
        </Grid>
      </Container> 
    );
  }
}

export default UserPark;