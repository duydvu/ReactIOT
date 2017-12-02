import React from 'react'
import ReactDom from 'react-dom'


import Devices from 'components/devices.jsx'
import Rooms from 'components/rooms.jsx'
import Nav from 'components/nav.jsx'

import './sass/main.sass'

import 'images/apps.png'
    
ReactDom.render(
    <div id="content">
        <Nav />
        <Rooms />
    </div>
    , document.getElementById('root')
)