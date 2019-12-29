import React, { Component } from "react";
import {Card, Image} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Cookies from 'js-cookie'

class UserCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            score: 0,
            submited: 0,
            passed: 0,
            createdtime: '',
        }
    }

    componentDidMount() {
        var name = Cookies.get("username");
        var score = Cookies.get("score");
        var submited = Cookies.get("submited");
        var passed = Cookies.get("passed");
        var createdtime = Cookies.get("createdtime");
        console.log(name)
        this.setState({
          username: name,
          score: score,
          submited: submited,
          passed: passed,
          createdtime: createdtime,
        });
    }

    render() {    
        return (
            <Card>
                <Image src='C:\Users\20929\go\src\github.com\JmPotato\Sudoku-frontend\sudoku-frontend\src\component\UserPark\photo.jpg' wrapped ui={true} />
                <Card.Content>
                    <Card.Header Content = {this.props.username} />
                    <Card.Meta>
                        <span className='date' Content={this.props.createdtime}/>
                    </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                    <Card.Description Content={"Username:\t"+this.props.username}/>
                    <Card.Description Content={"Score:\t"+this.props.score}/>
                    <Card.Description Content={"Submit:\t"+this.props.submited}/>
                    <Card.Description Content={"Pass:\t"+this.props.passed}/>
                </Card.Content>
            </Card>
        );
  }
}
export default UserCard
