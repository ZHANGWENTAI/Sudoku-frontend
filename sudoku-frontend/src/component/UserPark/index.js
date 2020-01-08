import React, { Component } from 'react'
import { Grid, Message, Container, Button } from 'semantic-ui-react'
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
    var name = Cookies.get("username");
    var score = Cookies.get("score");
    var submited = Cookies.get("submited");
    var passed = Cookies.get("passed");
    var createdtime = Cookies.get("createdtime");
    super(props);
    this.state = {
      error: '',
      puzzleContent: initPuzzleContent,
      pid: 0,
      activeRow: 0,
      activeColumn: 0,
      username: name,
      uid: 0,
      score: score,
      submited: submited,
      passed: passed,
      createdtime: createdtime.substr(0, 10),
      message: ''
    };
  }

  //generate pid and level according difficulty then send request to backend
  handleNewProblem(difficulty) {
    var that = this
    let gen = new Promise(function (resolve) {
      resolve({ pid: Math.floor(Math.random() * 100) + 1, level: 21 + difficulty + Math.floor(Math.random() * 3) });
    });
    gen.then(function (PL) {
      PuzzleAPI.pullnewproblem(PL.pid, PL.level).then(response => {
        response.json().then(data => {
          if (data.message === "Success") {
            that.setState({
              puzzleContent: data.data.content,
              pid: data.data.pid
            })
          } else {
            that.setState({ error: data.message });
          }
        });
      });
    })
  }

  //check whether the board is fullfiled and whether the answer is right, finally submit
  handleSubmit() {
    var that = this
    if (this.state.puzzleContent.search('0') !== -1) {
      this.setState({
        error: "Please complete the table before submit"
      })
    }
    else {
      let uid = Cookies.get('uid')
      let authentication = Cookies.get('authentication')
      let pid = this.state.pid
      var grid = new SudokuGrid(this.state.puzzleContent)
      let passed = grid.check() ? 1 : 0
      PuzzleAPI.postsubmit(uid, authentication, pid, passed).then(response => {
        response.json().then(data => {
          if (data.message === "Success") {
            if (passed === 1) {
              this.setState({
                message: 'Bingo!'
              })
            } else {
              this.setState({
                message: 'Oops! Your answer is wrong!'
              })
            }
            Cookies.set("submited", data.data.submited)
            Cookies.set("passed", data.data.passed)
            Cookies.set("score", data.data.score)
            this.setState({
              username: data.data.username,
              uid: data.data.uid,
              score: data.data.score,
              submited: data.data.submited,
              passed: data.data.passed
            })
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
    grid.rows[this.state.activeRow][this.state.activeColumn] = value
    // var rightstep = grid.check(this.state.activeRow, this.state.activeColumn, parseInt(value, 10))
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
      error: '',
      message: ''
    });
  }

  render() {
    var message;
    if (this.state.error !== "") {
      message = (
        <Message size="big" negative>
          <p>{this.state.error}</p>
        </Message>
      )
    }
    if (this.state.error === "" && this.state.message !== "") {
      message = (
        <Message size="big">
          <p>{this.state.message}</p>
        </Message>
      )
    }
    return (
      <Container style={{ marginTop: '3em' }}>
        <Grid>
          <Grid.Row centered>
            <Grid.Column width={16}>
              {message}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row >
            <Grid.Column width={4}>
              <UserCard
                username={this.state.username}
                score={this.state.score}
                submited={this.state.submited}
                passed={this.state.passed}
                createdtime={this.state.createdtime}
              />
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
            <Button color='teal' size='large' style={{ marginRight: '15px' }} onClick={() => { this.setState({ message: 'Checking and submitting...' }); this.handleSubmit(); }}> Submit </Button>
            <Button.Group>
              <Button color='green' size='large' onClick={() => this.handleNewProblem(8)}> Easy </Button>
              <Button.Or />
              <Button color='yellow' size='large' onClick={() => this.handleNewProblem(4)}> Medium </Button>
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