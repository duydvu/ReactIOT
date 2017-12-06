import React from 'react'
import { Route } from 'react-router-dom'
import Axios from 'axios'
import logo from 'images/apps.png'

export default class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
    }

    logOut() {
        window.location.href = 'http://localhost:3000/logout'
    }

    render() {
        return (
            <div className="nav">
                <a href="/">
                    <img src={logo} alt="ReactIOT logo" width="50" height="50" />
                    <h1>ReactIOT</h1>
                </a>
                <div onClick={this.logOut}>Đăng xuất</div>
            </div>
        )
    }
}