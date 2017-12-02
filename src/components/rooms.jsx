import React from 'react'
import axios from 'axios'
import openSocket from 'socket.io-client';
const socket = openSocket('https://reactiot.herokuapp.com/');

export default class Rooms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            all_rooms: []
        }
        this.fetchData = this.fetchData.bind(this);
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData() {
        var self = this;
        axios.get('https://reactiot.herokuapp.com/db/1', {
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
        this.props.push(id, name);
    }

    render() {
        const rooms = this.state.all_rooms.map((e) =>
            <div key={e.id}>
                <table>
                    <tbody>
                        <tr>
                            <td>ID phòng:</td>
                            <td>{e.id}</td>
                        </tr>
                        <tr>
                            <td>Tên phòng:</td>
                            <td>{e.room_name}</td>
                        </tr>
                        <tr>
                            <td>Thiết bị đang hoạt động:</td>
                            <td>{this.state.rooms.filter(t => t.room_id == e.id)[0] ? this.state.rooms.filter(t => t.room_id == e.id)[0].active : 0}
                                /{this.state.rooms.filter(t => t.room_id == e.id)[0] ? this.state.rooms.filter(t => t.room_id == e.id)[0].total : 0}</td>
                        </tr>
                    </tbody>
                </table>
                <div onClick={() => this.handleClick(e.id, e.room_name)}>Xem phòng</div>
            </div>
        )
        return (
            <div className="rooms">
                {rooms}
            </div>
        )
    }
}