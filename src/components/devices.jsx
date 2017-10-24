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
            <div className="item" key={i}>
                <div><span>ID thiết bị :</span>{e.id}</div>
                <div><span>Tên :</span>{e.name}</div>
                <div><span>Vĩ độ :</span>{e.latitude ? e.latitude : 'null'}</div>
                <div><span>Kinh độ :</span>{e.longitude ? e.longitude : 'null'}</div>
                <div><span>Trạng thái :</span>{e.status}</div>
            </div>
        );
        return (
            <div className="devices">
                {item}
            </div>
        )
    }
}