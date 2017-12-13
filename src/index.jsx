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
        <Router>
            <div>
                <Route render={(props) =>
                    <Nav {...props} />
                }/>
                <div style={{paddingTop: '50px'}}>
                    <Route exact path="/login" render={(props) =>
                        <Login {...props} />
                    } />
                    <Route exact path="/" render={(props) => 
                        <Rooms {...props}/>
                    } />
                    <Route exact path="/room/:name/:id" render={(props) => 
                        <Devices {...props}/>
                    } />
                </div>
            </div>
        </Router>
    </div>
    , document.getElementById('root')
)