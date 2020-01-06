import React, { Component } from "react";
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'

import md5 from "md5";
import Cookies from 'js-cookie'
import UserAPI from "../../logic/UserAPI";

class LoginFrom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: "",
            showRegisterPage: false
        }

        this.changePage = this.changePage.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.handleSignupSubmit = this.handleSignupSubmit.bind(this);
    }

    changePage() {
        if (this.state.showRegisterPage) {
            this.setState({ showRegisterPage: false })
        } else {
            this.setState({ showRegisterPage: true })
        }
    }

    handleLoginSubmit(e) {
        e.preventDefault();
        if (this.username === undefined || this.password === undefined) {
            this.setState({ error: "Please fill the form correctly"});
            return;
        }

        const authentication = md5(this.username + this.password)
        UserAPI.login(this.username, authentication).then(response => {
            response.json().then(data => {
                if (data.message !== "Success") {
                    this.setState({ error: data.message });
                }
                else{
                    console.log(data)
                    Cookies.set("authentication", authentication, {expires: 7});
                    Cookies.set("username", data.data.username, {expires: 7});
                    Cookies.set("submited", data.data.submited, {expires: 7});
                    Cookies.set("passed", data.data.passed, {expires: 7});
                    Cookies.set("score", data.data.score, {expires: 7});
                    Cookies.set("createdtime", data.data.created_time, {expires: 7});
                    this.props.onLogin()
                }
            });
        });
    }

    handleSignupSubmit(e) {
        e.preventDefault();
        if (this.username === undefined || this.password === undefined || this.repassword === undefined) {
            this.setState({ error: "Please fill the form correctly"});
            return;
        }
        if (this.password !== this.repassword) {
            this.setState({ error: "Please enter the passowrd correctly"});
            return;
        }

        const authentication = md5(this.username + this.password)
        UserAPI.signup(this.username, authentication).then(response => {
            response.json().then(data => {
                if (data.message !== "Success") {
                    this.setState({ error: data.message });
                }
                else{
                    Cookies.set("authentication", authentication, {expires: 7});
                    Cookies.set("uid", data.data.uid, {expires: 7});
                    Cookies.set("username", data.data.username, {expires: 7});
                    Cookies.set("submited", data.data.submited, {expires: 7});
                    Cookies.set("passed", data.data.passed, {expires: 7});
                    Cookies.set("score", data.data.score, {expires: 7});
                    Cookies.set("createdtime", data.data.createdTime, {expires: 7});
                    this.props.onLogin()
                }
            });
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
        if (!this.state.showRegisterPage) {
            return (
                <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>Sudoku Account</Header>
                        {message}
                        <Form size='large' onSubmit={this.handleLoginSubmit}>
                            <Segment stacked>
                                <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' type='text' onChange={evt => this.username = evt.target.value} />
                                <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password' type='password' onChange={evt => this.password = evt.target.value} />
                                <Button color='teal' fluid size='large' type='submit'>Log in</Button>
                                Or
                                <Button color='teal' fluid size='large' type='button' onClick={this.changePage}>To Sign Up</Button>
                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            );
        } else {
            return (
                <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>Sudoku Account</Header>
                        {message}
                        <Form size='large' onSubmit={this.handleSignupSubmit}>
                            <Segment stacked>
                                <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' type='text' onChange={evt => this.username = evt.target.value} />
                                <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password' type='password' onChange={evt => this.password = evt.target.value} />
                                <Form.Input fluid icon='lock' iconPosition='left' placeholder='Repassword' type='password' onChange={evt => this.repassword = evt.target.value} />
                                <Button color='teal' fluid size='large' type='submit'>Sign up</Button>
                                Or
                                <Button color='teal' fluid size='large' type='button' onClick={this.changePage}>To Log in</Button>
                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            );
        }
    }
}

export default LoginFrom;