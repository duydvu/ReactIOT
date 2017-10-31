import React from 'react'
import axios from 'axios'
import Chart from 'chart.js'
import openSocket from 'socket.io-client';
const socket = openSocket('https://reactiot.herokuapp.com/');

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
        
        socket.emit('switch', {
            id: self.props._id,
            status: JSON.stringify(status)
        });
                
    }

    componentDidMount() {
        // var self = this;
        // var ctx = this.canvas.getContext('2d');
        // var data = this.props.consumption.map((e, i) => {
        //     return {
        //         x: new Date(self.props.time[i]).getMinutes(),
        //         y: e
        //     }
        // });
        // var myChart = new Chart(ctx, {
        //     type: 'line',
        //     data: {
        //         datasets: [{
        //             data: data,
        //             fill: false,
        //             borderColor: '#fff',
        //             cubicInterpolationMode: 'monotone'
        //         }]
        //     },
        //     options: {
        //         scales: {
        //             xAxes: [{
        //                 type: 'linear',
        //                 position: 'bottom',
        //                 ticks: {
        //                     fontColor: '#fff',
        //                 },
        //             }],
        //             yAxes: [{
        //                 ticks: {
        //                     fontColor: '#fff',
        //                     beginAtZero: true,
        //                     suggestedMax: 300
        //                 },
        //             }]
        //         },
        //         legend: {
        //             display: false
        //         },
        //     }
        // });
    }

    render() {
        return (
            <div className="item">
                <div className="info" style={{ background: this.color }}>
                    <div className="row"><span>ID thiết bị : </span>{this.props._id}</div>
                    <div className="row"><span>Tên : </span>{this.props.name}</div>
                    <div className="row"><span>Vị trí : </span>{this.props.location}</div>
                    <div className="row">
                        <span>Trạng thái : </span>
                        <Toggle color={this.color} on={this.props.status} switch={this.updateData} />
                    </div>
                    <div className="row" style={{textAlign: 'center'}}>Tiêu thụ diện</div>
                    <div className="row">
                        <canvas className="chart" ref={can => {this.canvas = can}}></canvas>
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
        this.setState(prev => ({ on: !prev.on }));
    }

    componentDidUpdate() {
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