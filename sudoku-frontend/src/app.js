import React, { Component } from "react";
import Cookies from "js-cookie"
import { BrowserRouter as Router, Route } from "react-router-dom";

import LoginForm from './component/LoginFrom/index'
import SudokuGame from './component/SudukoGame/index'


class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: false
        };

        this.onLogin = this.onLogin.bind(this);
    }

    componentDidMount() {
        var token = Cookies.get("authentication");
        if (token) {
            this.setState({
                login: true,
            });
        }
    }

    onLogin(data) {
        Cookies.set("authentication", data, {expires: 7});
        this.setState({
            login: true,
        });
    }

    render() {
        if (this.state.login) {
            return (<SudokuGame />);
        } else {
            return (<LoginForm onLogin={this.onLogin} />);
        }
    }
}

const App = () => (
    <Router>
        <Route path="/" exact component={HomePage} />
    </Router>
);


export default App;