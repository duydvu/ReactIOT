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
            .then(function (response) {console.log(response);
                self.setState({ devices: response });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        const item = this.state.devices.map((e, i) => 
            <div className="item">
                <div>e.id</div>
                <div>e.name</div>
                <div>e.latitude</div>
                <div>e.longitude</div>
                <div>e.status</div>
            </div>
        );
        return (
            <div className="devices">
                {item}
            </div>
        )
    }
}