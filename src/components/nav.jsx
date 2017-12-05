import React from 'react'
import logo from 'images/apps.png'

export default class Nav extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="nav">
                <a href="/">
                    <img src={logo} alt="ReactIOT logo" width="50" height="50" />
                    <h1>ReactIOT</h1>
                </a>
            </div>
        )
    }
}