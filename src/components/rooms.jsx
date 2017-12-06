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
        axios.get('http://localhost:3000/db', {
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

    render() {
        const rooms = this.state.all_rooms.map((e) =>
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
                </div>
            </div>
        )
        return (
            <div className="rooms">
                {rooms}
            </div>
        )
    }
}