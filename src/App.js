import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import Garage from './Garage/Garage';
import Garages from './Garages/Garages';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar/>
        <Route exact path='/' component={Garages}/>
        <Route exact path='/garage/:garageName' component={Garage}/>
      </div>
    );
  }
}

export default App;
