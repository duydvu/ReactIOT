import React from 'react'
import ReactDom from 'react-dom'
import axios from 'axios'

import Devices from 'components/devices.jsx'

import './sass/main.sass'

import 'images/apps.png'

axios.post('https://reactiot.herokuapp.com/insert', {
    data: {
        id: '101',
        name: 'ABC',
        latitude: 'null',
        longitude: 'null',
        status: 'enable'
    }
})
    .then(function (response) {
        console.log(response)
    })
    .catch(function (error) {
        console.log(error);
    });

ReactDom.render(
    <div id="content">
        <h1>Welcome to ReactIOT!</h1>
        <Devices />
    </div>
    , document.getElementById('root')
)