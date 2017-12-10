import React from 'react'
import { Route } from 'react-router-dom'
import Axios from 'axios'
import logo from 'images/apps.png'

export default class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addRoom: false,
            roomName: '',
            addDevice: false,
            deviceID: '',
            deviceName: '',
            status: false,
            roomId: '',
            timerStatus: false
        };
        this.logOut = this.logOut.bind(this);
        this.toggleAddRoom = this.toggleAddRoom.bind(this);
        this.toggleAddDevice = this.toggleAddDevice.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.addRoom = this.addRoom.bind(this);
        this.addDevice = this.addDevice.bind(this);
    }

    logOut() {
        Axios.get('/logout').then((response) => {
            if (response.status == 200)
                window.location.href = API_URL;
        })
    }

    toggleAddRoom() {
        this.setState(prev => ({ addRoom: !prev.addRoom && !prev.addDevice }))
    }

    toggleAddDevice() {
        this.setState(prev => ({ addDevice: !prev.addDevice && !prev.addRoom}))
    }

    handleInputChange(e) {
        this.setState({ [e.target.id]: e.target.value });
    }

    addRoom(e) {
        e.preventDefault();
        Axios.post(API_URL + 'addroom', {
            name: this.state.roomName,
        }).then(response => {
            console.log(response);
        }).catch((error) => {
            alert("Kiểm tra kết nối!");
        });
    }

    addDevice(e) {
        e.preventDefault();console.log(this.state);
        Axios.post(API_URL + 'device', {
            ID: parseInt(this.state.deviceID),
            name: this.state.deviceName,
            status: this.state.status,
            room_id: this.state.roomId,
            timer_status: this.state.timerStatus
        }).then(response => {
            console.log(response);
        }).catch((error) => {
            alert("Kiểm tra kết nối!");
        });
    }

    render() {
        return (
            <div className="nav">
                <a href="/">
                    <img src={logo} alt="ReactIOT logo" width="50" height="50" />
                    <h1>ReactIOT</h1>
                </a>
                <Route path="/" render={({ location }) =>
                    location.pathname === '/login' ? null :
                        <div onClick={this.logOut} className="logout"><span>Đăng xuất</span></div>
                } />
                <Route path="/" render={({ location }) =>
                    location.pathname === '/login' ? null :
                        <div onClick={this.toggleAddRoom} className="toggleAddRoom"><span>Thêm phòng</span></div>
                } />
                <Route exact path="/room/:name/:id" render={() => 
                    <div onClick={this.toggleAddDevice} className="toggleAddDevice"><span>Thêm thiết bị</span></div>
                }/>
                <div className={this.state.addRoom ? "addRoom on" : "addRoom"}>
                    <form onSubmit={this.addRoom}>
                        <div>
                            <label htmlFor="roomName">Tên phòng</label>
                            <input type="text" name="roomName" id="roomName" onChange={this.handleInputChange} />
                        </div>
                        <div>
                            <input type="submit" value="Thêm" />
                        </div>
                    </form>
                </div>
                <div className={this.state.addDevice ? "addDevice on" : "addRoom"}>
                    <form onSubmit={this.addDevice}>
                        <div>
                            <label htmlFor="deviceID">ID thiết bị:</label>
                            <input type="text" name="deviceID" id="deviceID" onChange={this.handleInputChange}/>
                        </div>
                        <div>
                            <label htmlFor="deviceName">Tên thiết bị:</label>
                            <input type="text" name="deviceName" id="deviceName" onChange={this.handleInputChange}/>
                        </div>
                        <div>
                            <label htmlFor="status">Trạng thái:</label>
                            <input type="text" name="status" id="status" onChange={this.handleInputChange}/>
                        </div>
                        <div>
                            <label htmlFor="roomId">ID phòng:</label>
                            <input type="text" name="roomId" id="roomId" onChange={this.handleInputChange}/>
                        </div>
                        <div>
                            <label htmlFor="timerStatus">Hẹn giờ:</label>
                            <input type="text" name="timerStatus" id="timerStatus" onChange={this.handleInputChange}/>
                        </div>
                        <div>
                            <input type="submit" value="Thêm"/>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}