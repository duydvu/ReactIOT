import React from 'react'
import ReactDom from 'react-dom'
import axios from 'axios'

import Devices from 'components/devices.jsx'
import Nav from 'components/nav.jsx'

import './sass/main.sass'

import 'images/apps.png'

ReactDom.render(
    <div id="content">
        <Nav />
        <Devices />
    </div>
    , document.getElementById('root')
)