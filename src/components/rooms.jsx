import React from 'react'
import axios from 'axios'
import openSocket from 'socket.io-client';
const socket = openSocket(API_URL);

export default class Rooms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            all_rooms: []
        }
        this.fetchData = this.fetchData.bind(this);
        this.delete = this.delete.bind(this);
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
                self.setState({ rooms: response.data.data1, all_rooms: response.data.data2 });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleClick(id, name) {
        this.props.history.push('/room/' + name + '/' + id); 
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

    render() {
        const rooms = this.state.all_rooms.length ? this.state.all_rooms.map((e) =>
            <div key={e.id}>
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
                    <div>
                        <div className="delete" onClick={() => {this.delete(e.id)}}>Xóa</div>
                    </div>
                </div>
            </div>
        ) : <div className="loading">Loading...</div>;
        return (
            <div className="rooms">
                {rooms}
            </div>
        )
    }
}