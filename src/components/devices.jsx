import React from 'react'
import axios from 'axios'
import Chart from 'chart.js'
import openSocket from 'socket.io-client';
const socket = openSocket(API_URL);

export default class Devices extends React.Component {
    constructor(props) {
        super(props);
        this.state = { devices: [] , current: new Array(49).fill(0)};
        this.fetchData = this.fetchData.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    componentDidMount() {
        this.fetchData();
        document.title = "Thiết bị";
        let self = this;
        socket.on('current', (data) => {
            this.setState((prevState, props) => ({
                current: [...prevState.current.slice(-99), data]
            }));
        })
    }

    fetchData() {
        var self = this;
        axios.get(API_URL + 'db/device/'+this.props.match.params.id, {
                responseType: 'json'
            })
            .then(function (response) {
                self.setState({ devices: response.data });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    updateData(message, data) {
        socket.emit('switch', data);
    }

    render() {
        const item = this.state.devices.map((e, i) => 
            <Device_item key={i} _id={e.id} name={e.name} status={e.status} current={this.state.current.filter(t => t.ID==e.id)} updateData={this.updateData}/>
        );
        return (
            <div>
                <h2>{this.props.match.params.name}</h2>
                <div className="devices">
                    {item}
                </div>
            </div>
        )
    }
} location

class Device_item extends React.Component {
    constructor(props) {
        super(props);
        this.switch = this.switch.bind(this);
    }

    switch(status) {
        var self = this;
        this.props.updateData('demo/switch', {
            ID: parseInt(self.props._id),
            Status: status? '1':'0'
        });
                
    }

    componentWillUpdate() {
        var self = this;
        var ctx = this.canvas.getContext('2d');
        var data = this.props.current.map((e, i) => {
            return {
                x: this.props.current.length - i - 1,
                y: e.value
            }
        });
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    data: data,
                    fill: false,
                    borderColor: '#fff',
                    cubicInterpolationMode: 'monotone'
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom',
                        ticks: {
                            fontColor: '#fff',
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            fontColor: '#fff',
                            beginAtZero: true,
                            suggestedMax: 10
                        },
                    }]
                },
                legend: {
                    display: false
                },
                animation: {
                    duration: 0
                }
            }
        });
    }

    render() {
        return (
            <div className="item">
                <div className="info">
                    <div className="row"><span>ID thiết bị : </span>{this.props._id}</div>
                    <div className="row"><span>Tên : </span>{this.props.name}</div>
                    <div className="row">
                        <span>Trạng thái : </span>
                        <Toggle on={this.props.status} switch={this.switch} />
                    </div>
                    <div className="row" style={{textAlign: 'center'}}>Cường độ dòng</div>
                    <div className="row">
                        <canvas className="chart" ref={can => {this.canvas = can}}></canvas>
                    </div>
                    <div className="row" style={{textAlign: 'center'}}>Năng lượng tiêu thụ</div>
                    <div className="row">
                        <canvas className="chart" ref={can => {this.canvas2 = can}}></canvas>
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
                <div className={`toggle-bk ${this.state.on ? '' : 'off'}`} onClick={this.handleClick}>
                    <div className="toggle-button"></div>
                </div>
                <span>{this.state.on ? 'Bật' : 'Tắt'}</span>
            </div>
        );
    }
} 