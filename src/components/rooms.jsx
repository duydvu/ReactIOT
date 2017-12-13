import React from 'react'
import axios from 'axios'
import openSocket from 'socket.io-client';
const socket = openSocket(API_URL);

export default class Rooms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            all_rooms: [],
            WillUnmount: false,
        }
        this.username = '';
        this.fetchData = this.fetchData.bind(this);
        this.delete = this.delete.bind(this);
        this.goBack = this.goBack.bind(this);
        this.goForward = this.goForward.bind(this);
    }

    componentWillMount() {
        this.fetchData();
        document.title = "Trang chủ"
    }

    fetchData() {
        var self = this;
        axios.get(API_URL + 'db', {
            responseType: 'json'
        })
            .then(function (response) {
                self.username = response.data.user.name;
                self.setState({ rooms: response.data.data1, all_rooms: response.data.data2 });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleClick(id, name) {
        this.setState({ WillUnmount: true }, () => {
            setTimeout(() => {
                this.props.history.push('/room/' + name + '/' + id); 
            }, 1000)
        })
    }

    delete(id) {
        axios.get(API_URL + 'delete/room/' + id).then(response => {
            alert('Xóa thành công!');
            window.location.reload();
        }).catch(err => {
            alert('Xóa thất bại!');
            window.location.reload();
        })
    }

    goBack() {
        this.props.history.goBack();
    }

    goForward() {
        this.props.history.goForward();
    }

    render() {
        const rooms = this.state.all_rooms.length ? this.state.all_rooms.map((e) =>
            <div key={e.id} className={ this.state.WillUnmount ? "unmount" : ""}>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td>ID:</td>
                                <td>{e.id}</td>
                            </tr>
                            <tr>
                                <td>Phòng:</td>
                                <td>{e.room_name}</td>
                            </tr>
                            <tr>
                                <td>Thiết bị:</td>
                                <td>{this.state.rooms.filter(t => t.room_id == e.id)[0] ? this.state.rooms.filter(t => t.room_id == e.id)[0].active : 0}
                                    /{this.state.rooms.filter(t => t.room_id == e.id)[0] ? this.state.rooms.filter(t => t.room_id == e.id)[0].total : 0}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="show_room" onClick={() => this.handleClick(e.id, e.room_name)}>Xem phòng</div>
                    <div className="delete" onClick={() => {this.delete(e.id)}}>Xóa</div>
                </div>
            </div>
        ) : <div className="loading">Đang tải...</div>;
        return (
            <div>
                <div className="header">
                    <div onClick={this.goBack}>&#8617;</div>
                    { this.username ? <h2><span>{'Xin chào ' + this.username + '!'}</span></h2> : null }
                    <div onClick={this.goForward}>&#8618;</div>
                </div>
                <div className="rooms">
                    {rooms}
                </div>
            </div>
        )
    }
}