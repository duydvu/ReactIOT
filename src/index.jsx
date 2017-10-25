import React from 'react'
import ReactDom from 'react-dom'
import axios from 'axios'

import Devices from 'components/devices.jsx'

import './sass/main.sass'

import 'images/apps.png'

ReactDom.render(
    <div id="content">
        <h1>Welcome to ReactIOT!</h1>
        <Devices />
    </div>
    , document.getElementById('root')
)