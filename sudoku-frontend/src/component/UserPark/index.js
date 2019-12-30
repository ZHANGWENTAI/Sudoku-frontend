import React, {Component} from 'react';
import {Grid, Message, Container, Button} from 'semantic-ui-react';
import SudokuBoard from './SudokuBoard'
import SudokuGrid from './SudokuBoard/sudokugrid';
import KeyBoard from './KeyBoard'
import UserCard from './UserCard'
import PuzzleAPI from "../../logic/PuzzleAPI"

class UserPark extends Component {
  constructor(props) {
    super(props);
    this.state = {
        error: '',
        puzzleContent: '',
        puzzleAnswer: '',
        activeRow: 0,
        activeColumn: 0,
    };
  }

  // solve() {
  //   const { puzzlecontent } = this.state,
  //   grid = new SudokuGrid(puzzlecontent);

  //   new Solver(grid).solve();
  //   this.setState({ puzzlecontent: grid.toFlatString() });
  // }

  //generate pid and level according difficulty then send request to backend
  handleNewProblem(difficulty) {
    var that = this
    let gen = new Promise(function(resolve) {
      resolve({ pid: Math.floor(Math.random() * 100) + 1, level: 24 + difficulty + Math.floor(Math.random()*3)});
    });
    gen.then(function(PL){
      PuzzleAPI.pullnewproblem(PL.pid, PL.level).then(response => {
        response.json().then(data => {
          if (data.message === "Success") {
            that.setState({puzzleContent: data.data.content})
          } else {
            that.setState({error: data.message});
          }
        });
      });
    }) 
  }

  //check whether the board is fullfiled and whether the answer is right, finally submit
  handleSubmit() {
    for(let i = 0; i < this.state.puzzleContent.length; i++) {
      if(this.state.puzzleContent.split("")[i] === '0') {
        this.setState({
          error: "Please complete the table before submit"
        })
      }
      else if(this.state.puzzleAnswer !== this.state.puzzleContent) {
        this.setState({
          error: "The answer is wrong"
        })
      }
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
      activeColumn: col
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
              <Button.Group>
                <Button color='teal'  size='large' style={{marginRight: '10px'}} onClick={() => this.handleSubmit()}> Submit </Button>
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