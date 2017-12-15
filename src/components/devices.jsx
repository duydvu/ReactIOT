import React from 'react'
import axios from 'axios'
import Chart from 'chart.js'
import openSocket from 'socket.io-client'
import TimePicker from 'rc-time-picker'
import moment from 'moment'
import 'rc-time-picker/assets/index.css'

const socket = openSocket(API_URL);
const format = 'hh:mm a';

export default class Devices extends React.Component {
    constructor(props) {
        super(props);
        this.devices = [];
        this.dataFetched = false;
        this.fetchData = this.fetchData.bind(this);
        this.goBack = this.goBack.bind(this);
        this.goForward = this.goForward.bind(this);
    }

    componentDidMount() {
        this.fetchData();
        document.title = "Thiết bị";
    }

    fetchData() {
        let self = this;
        axios.get(API_URL + 'db/device/'+this.props.match.params.id, {
                responseType: 'json'
            })
            .then(function (response) {
                var data = response.data;
                self.devices = data ? data : self.devices;
                self.dataFetched = true;
                self.forceUpdate();
                socket.emit('subscribe', data.map(e => (e.id)));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    goBack() {
        this.props.history.goBack();
    }

    goForward() {
        this.props.history.goForward();
    }

    render() {
        const item = this.devices.length ? this.devices.map((e, i) => 
            <Device_item key={i} _id={e.id} name={e.name} status={e.status} time={e.time} timer_status={e.timer_status} power={{ value: e.value.reverse(), date: e.date.reverse()}} match={this.props.match} />
        ) : <div className="loading">{this.dataFetched ? "Không có thiết bị" : "Đang tải..."}</div>;
        return (
            <div>
                <div className="header">
                    <div onClick={this.goBack}>&#8617;</div>
                    <h2><span>{this.props.match.params.name}</span></h2>
                    <div onClick={this.goForward}>&#8618;</div>
                </div>
                <div className="devices">
                    {item}
                </div>
            </div>
        )
    }
}

class Device_item extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            current: new Array(50).fill(0),
            status: this.props.status
        }
        this.time = moment().hour(this.props.time.slice(0, 2)).minute(this.props.time.slice(3, 5)).second(this.props.time.slice(-2));
        this.switch1 = this.switch1.bind(this);
        this.switch2 = this.switch2.bind(this);
        this.drawCurrent = this.drawCurrent.bind(this);
        this.delete = this.delete.bind(this);
    }

    switch1(status) {
        this.setState({ status });
        socket.emit('switch', {
            ID: parseInt(this.props._id),
            Status: status ? '1':'0'
        });
    }

    switch2(status) {
        var time = this.time.format(format);
        if(time.slice(-2) == 'am') {
            if(time.slice(0, 2) == '12') {
                time = '00' + time.slice(2);
            }
        }
        else {
            if(time.slice(0, 2) != '12') {
                time = (parseInt(time.slice(0, 2)) + 12) + time.slice(2);
            }
        }
        time = time.slice(0, 5) + ':00';
        socket.emit('timer', {
            id: this.props._id,
            time: time,
            status
        });
    }

    componentDidMount() {
        let self = this;

        socket.on('current', (data) => {
            this.setState(prev => {
                if (data.ID == this.props._id)
                    return { current: [data.value, ...prev.current.slice(0, 48)] }
                else
                    return
            });
        })
        socket.on('switch', (data) => {
            if (self.props._id == data.ID) {
                self.setState({ status: parseInt(data.Status) });
            }
        })

        var ctx = this.canvas2.getContext('2d');
        var labels = this.props.power.date.map((e, i) => {
            return this.props.power.date.length - i + ' days ago';
        });
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: self.props.power.value,
                    borderWidth: 1,
                    backgroundColor: '#304FFE'
                }]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            suggestedMax: 500
                        }
                    }]
                }
            }
        });
        this.drawCurrent();
    }

    componentDidUpdate() {
        this.drawCurrent();
    }

    drawCurrent() {
        var ctx = this.canvas.getContext('2d');
        var data = this.state.current.map((e, i) => {
            return {
                x: this.state.current.length - i - 1,
                y: e
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

    delete() {
        axios.get(API_URL + 'delete/device/' + this.props._id + '/' + this.props.match.params.id).then(response => {
            window.location.reload();
        }).catch(err => {
            window.location.reload();
        })
    }

    render() {
        return (
            <div className="item">
                <div className="info">
                    <div className="row"><span>ID thiết bị : </span>{this.props._id}</div>
                    <div className="row"><span>Tên : </span>{this.props.name}</div>
                    <div className="row">
                        <span>Trạng thái : </span>
                        <Toggle on={this.state.status} switch={this.switch1} />
                    </div>
                    <div className="row">
                        <span>Hẹn giờ : </span>
                        <TimePicker
                            showSecond={false}
                            defaultValue={this.time}
                            className="xxx"
                            format={format}
                            onChange={(value) => {
                                this.time = value;
                            }}
                            use12Hours
                        />
                        <Toggle on={this.props.timer_status} switch={this.switch2} />                        
                    </div>
                    <div className="row" style={{textAlign: 'center'}}>Cường độ dòng</div>
                    <div className="row">
                        <canvas className="chart" ref={can => {this.canvas = can}}></canvas>
                    </div>
                    <div className="row" style={{textAlign: 'center'}}>Năng lượng tiêu thụ</div>
                    <div className="row">
                        <canvas className="chart" ref={can => {this.canvas2 = can}}></canvas>
                    </div>
                    <div onClick={this.delete} className="delete">Xóa</div>
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
        this.setState(prev => ({ on: !prev.on }), () => {
            this.props.switch(this.state.on);
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.on != this.props.on)
            this.setState({ on: nextProps.on });
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