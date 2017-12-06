import React from 'react'
import axios from 'axios'

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {username: '', password: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(e) {
        if(e.target.type === 'text')
            this.setState({username: e.target.value});
        else 
            this.setState({password: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:3000/login', {
            username: this.state.username,
            password: this.state.password,
        })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Tài khoản:
                        <input type="text" name="username" onChange={this.handleInputChange}/>
                    </label>
                    <label>
                        Mật khẩu:
                        <input type="password" name="password" onChange={this.handleInputChange}/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }
}