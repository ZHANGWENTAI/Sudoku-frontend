import React, {Component} from 'react';
import {Grid, Message, Container, Divider, Button} from 'semantic-ui-react';
import SudokuBoard from './SudokuBoard'
import KeyBoard from './KeyBoard'
import UserCard from './UserCard'
import Cookies from 'js-cookie'
import PuzzleAPI from '../../logic/PuzzleAPI'

class UserPark extends Component {
  constructor(props) {
    super(props);
    this.state = {
        error: '',
        user: {
          name: '',
          score: 0,
          submited: 0,
          passed: 0,
          createdtime: '',
        },
        puzzleContent: '',
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
  componentDidMount() {
    var user = Cookies.get("user");
    this.setState({
      user: user,
    });
  }

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

  }

  // update the state with the new puzzle string
  handleKeyClick(value) {
    var pc = this.state.puzzleContent.split("")
    pc[9 * this.state.activeRow + this.state.activeColumn] = value;
    this.setState({ puzzleContent: pc.toString() });
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
            <Message negative>
                <Message.Header>Oops!</Message.Header>
                <p>{ this.state.error }</p>
            </Message>
        )
    }
    return (
      <Container style={{ marginTop: '2em' }}>
        <Grid>
          {message}
          <Grid.Column width={4}>
            <UserCard
              userInfo={this.state.user}
            />
            {/* <GridRow>
              <TodoList/>
            </GridRow> */}
          </Grid.Column>
          <Grid.Column width={9}>
            <Grid.Row>
              <SudokuBoard
                puzzleContent={this.state.puzzleContent}
                onCellChosen={this.onCellChosen.bind(this)}
              />
            </Grid.Row>
            <Grid.row>
              <Button color='teal' size='large' type='button' onClick={() => this.handleSubmit()}>Submit </Button>
              <Divider vertical/>
              <Button.Group>
                <Button color='green' size='large' type='button' onClick={() => this.handleNewProblem(8)}>Easy</Button>
                <Button.Or />
                <Button color='yellow' size='large' type='button' onClick={() => this.handleNewProblem(4)}>Medium</Button>
                <Button.Or />
                <Button color='red' size='large' type='button' onClick={() => this.handleNewProblem(0)}>Hard</Button>
              </Button.Group>
            </Grid.row>
          </Grid.Column>
          <Grid.Column width={3}>
            <KeyBoard
              handleKeyClick={this.handleKeyClick.bind(this)}
            />
          </Grid.Column>
        </Grid>
      </Container> 
    );
  }
}

export default UserPark;