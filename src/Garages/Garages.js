import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class Garages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      garages: null,
    };
  }

  async componentDidMount() {
    var garages = (await axios.get('https://murmuring-waters-47073.herokuapp.com/garage')).data;

    var occupied = {};
    for(var i = 0; i < garages.garages.length; i++) {
      occupied[garages.garages[i].name] =  0;
      for(var j = 0; j < garages.garages[i].sensors.length; j++) {
        const sensor = (await axios.get(`https://murmuring-waters-47073.herokuapp.com/sensor/${garages.garages[i].sensors[j]}`)).data;
        if(sensor.sensor.length > 0) {
          var count = sensor.sensor[0].cars;
          occupied[garages.garages[i].name] = occupied[garages.garages[i].name] + count;
        }
      }
      garages.garages[i].occupied = occupied[garages.garages[i].name];
    }

    this.setState({
      garages
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          {this.state.garages === null && <p> Loading garages...</p>}
          {
            this.state.garages && this.state.garages.garages.map(garage => (
              <div key={garage.name} className="col-sm-12 col-md-4 col-lg-3">
                <Link to={`/garage/${garage.name}`}>
                  <div className="card text-white bg-success mb-3">
                    <div className="card-header">Parking Garage {garage.name}</div>
                    <div className="card-body">
                      <h4 className="card-title">Availability {garage.occupied}/{garage.totalSpots}</h4>
                      <p className="card-text"></p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

export default Garages;
