import React from 'react'
import ReactDom from 'react-dom'
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import Devices from 'components/devices.jsx'
import Rooms from 'components/rooms.jsx'
import Nav from 'components/nav.jsx'
import Login from 'components/login.jsx'

import './sass/main.sass'

import 'images/apps.png'
import 'images/bliss.jpg'
    
ReactDom.render(
    <div id="content">
        <Nav />
        <Router>
            <div style={{paddingTop: '50px'}}>
                <Route exact path="/login" component={Login} />
                <Route exact path="/" render={({history}) => 
                    <Rooms history={history}/>
                } />
                <Route exact path="/room/:name/:id" component={Devices} />
            </div>
        </Router>
    </div>
    , document.getElementById('root')
)