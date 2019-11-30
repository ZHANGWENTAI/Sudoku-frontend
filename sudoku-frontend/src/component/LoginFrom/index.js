import React, { Component } from "react";
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'

import md5 from "md5";

import UserAPI from "../../logic/UserAPI";

class LoginFrom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: ""
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const authentication = md5(this.username + this.password)

        UserAPI.login(this.username, authentication).then(response => {
            response.json().then(data => {
                if (data.message != "Success") {
                    this.setState({ error: data.message });
                    return;
                }
                this.props.onLogin(authentication);
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
        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='teal' textAlign='center'>Log-in to your account</Header>
                    {message}
                    <Form size='large' onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' type='text' onChange={evt => this.username = evt.target.value} />
                            <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password' type='password' onChange={evt => this.password = evt.target.value} />
                            <Button color='teal' fluid size='large'>Login</Button>
                        </Segment>
                    </Form>
                    <Message>
                        New to us? <a href='#'>Sign Up</a>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default LoginFrom;