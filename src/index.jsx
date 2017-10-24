import React from 'react'
import ReactDom from 'react-dom'

import './sass/main.sass'

import Devices from 'components/devices.jsx'

ReactDom.render(
    <div id="content">
        <Devices />
    </div>
    , document.getElementById('root')
)