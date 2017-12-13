import React from 'react'
import Axios from 'axios'

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {username: '', password: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        document.title = "Đăng nhập"
    }

    handleInputChange(e) {
        if(e.target.type === 'text')
            this.setState({username: e.target.value});
        else 
            this.setState({password: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        Axios.post(API_URL + 'login', {
            username: this.state.username,
            password: this.state.password,
        }).then(response => {
            this.props.history.replace('/')
        }).catch((error) => {
            if(error.response.status == 401)
                alert("Sai password!");
            else alert("Kiểm tra kết nối!");
        });
    }

    render() {
        return (
            <div className="login">
                <form onSubmit={this.handleSubmit}>
                        <div>
                            <label htmlFor="username">
                                Tài khoản:
                            </label>
                            <input type="text" name="username" id="username" placeholder="account1" onChange={this.handleInputChange}/>
                        </div>
                        <div>
                            <label htmlFor="password">
                                Mật khẩu:
                            </label>
                            <input type="password" name="password" id="password" placeholder="z" onChange={this.handleInputChange}/>
                        </div>
                        <div>
                            <input type="submit" value="Đăng nhập" />
                        </div>
                </form>
            </div>
        )
    }
}