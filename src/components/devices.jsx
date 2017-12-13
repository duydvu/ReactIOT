import React from 'react'
import axios from 'axios'
import Chart from 'chart.js'
import openSocket from 'socket.io-client';
const socket = openSocket(API_URL);

export default class Devices extends React.Component {
    constructor(props) {
        super(props);
        this.devices = [];
        this.dataFetched = false;
        this.fetchData = this.fetchData.bind(this);
        this.updateData = this.updateData.bind(this);
        this.goBack = this.goBack.bind(this);
        this.goForward = this.goForward.bind(this);
    }

    componentDidMount() {
        this.fetchData();
        document.title = "Thiết bị";
        socket.on('switch', (data) => {
            let updateTarget = this.devices.filter(t => t.id == data.ID);
            console.log('Update device "' + updateTarget.name + '" to status' + (data.Status ? 'ON' : 'OFF'));
            updateTarget.status = data.Status;
            this.forceUpdate();
        })
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

    updateData(message, data) {
        socket.emit('switch', data);
        console.log('Send HTTP: ' + JSON.stringify(data));
    }

    goBack() {
        this.props.history.goBack();
    }

    goForward() {
        this.props.history.goForward();
    }

    render() {
        const item = this.devices.length ? this.devices.map((e, i) => 
            <Device_item key={i} _id={e.id} name={e.name} status={e.status} power={{ value: e.value.reverse(), date: e.date.reverse()}} updateData={this.updateData}/>
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
        this.state = { current: new Array(50).fill(0) }
        this.switch = this.switch.bind(this);
        this.drawCurrent = this.drawCurrent.bind(this);
        this.delete = this.delete.bind(this);
    }

    switch(status) {
        this.props.updateData('demo/switch', {
            ID: parseInt(this.props._id),
            Status: status? '1':'0'
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
        axios.get(API_URL + 'delete/device/' + this.props._id).then(response => {
            alert('Xóa thành công!');
            window.location.reload();
        }).catch(err => {
            alert('Xóa thất bại!');
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