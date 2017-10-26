import React from 'react'
import axios from 'axios'

export default class Devices extends React.Component {
    constructor(props) {
        super(props);
        this.state = { devices: [] };
        this.fetchData = this.fetchData.bind(this);
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData() {
        var self = this;
        axios.get('https://reactiot.herokuapp.com/db', {
                responseType: 'json'
            })
            .then(function (response) {
                self.setState({ devices: response.data });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        const item = this.state.devices.map((e, i) => 
            <Device_item key={i} _id={e.id} name={e.name} location={e.location} status={e.status} />
        );
        return (
            <div className="devices">
                {item}
            </div>
        )
    }
}

class Device_item extends React.Component {
    constructor(props) {
        super(props);
        var colorList = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#009688', '#4CAF50', '#FF5722', '#607D8B'];
        this.color = colorList[Math.floor(Math.random() * 10)];
        this.updateData = this.updateData.bind(this);
    }

    updateData(status) {
        var self = this;
        axios.post('https://reactiot.herokuapp.com/switch', {
                data: {
                    id: self.props._id,
                    status: JSON.stringify(status)
                }
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="item" style={{background: this.color}}>
                <div className="info">
                    <div className="row"><span>ID thiết bị : </span>{this.props._id}</div>
                    <div className="row"><span>Tên : </span>{this.props.name}</div>
                    <div className="row"><span>Vị trí : </span>{this.props.location}</div>
                    <div className="row">
                        <span>Trạng thái : </span>
                        <Toggle color={this.color} on={this.props.status} switch={this.updateData} />
                    </div>
                </div>
            </div>
        )
    }
}

class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = { on : this.props.on };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(prev => ({ on : !prev.on }));
        this.props.switch(this.state.on);
    }

    render() {
        return (
            <div className="toggle">
                <div className="toggle-bk" onClick={this.handleClick}>
                    <div className={`toggle-button ${this.state.on?'':'off'}`} style={{background: this.props.color}}></div>
                </div>
                <span>{this.state.on ? 'Bật' : 'Tắt'}</span>
            </div>
        );
    }
} 