import React, {Component} from 'react';
import axios from 'axios';

class Garage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      garage: null,
      percentage: 0
    };
  }

  async componentDidMount() {
    const { match: { params } } = this.props;
    const garage = (await axios.get(`https://murmuring-waters-47073.herokuapp.com/garage/${params.garageName}`)).data;

    var occupied = {};
    garage.garage[0].spotAval = []

    occupied[garage.garage[0].name] =  0;
    for(var j = 0; j < garage.garage[0].sensors.length; j++) {
      const sensor = (await axios.get(`https://murmuring-waters-47073.herokuapp.com/sensor/${garage.garage[0].sensors[j]}`)).data;
      var count = sensor.sensor[0].cars;
      garage.garage[0].spotAval.push(sensor.sensor[0].spots);
      occupied[garage.garage[0].name] += count;
    }
    garage.garage[0].occupied = occupied[garage.garage[0].name];

    console.log(garage.garage[0].spotAval)

    this.setState({
      garage,
    });
  }

  render() {
    const {garage} = this.state;
    if (garage === null) return <p>Loading ...</p>;
    return (
      <div className="container">
        <div className="row">
          <div className="jumbotron col-12">
            <h5 className="display-3">Parking Garage {garage.garage[0].name}</h5>
            <p className="lead"></p>
            <hr className="my-4" />
            <p>{garage.garage[0].occupied} remaining spots out of {garage.garage[0].totalSpots}</p>
            <hr className="my-4" />
            <div>
            {
              garage.garage[0].spotAval.map(spots => (
                spots.map(spot => (
                  <p>Spot {spot.spotID}: {spot.occupied} </p>
                ))
              ))
            }
            </div>

            <div>
              <ProgressBar percentage={Math.floor((garage.garage[0].occupied/garage.garage[0].totalSpots) * 100)} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const ProgressBar = (props) => {
  return (
    <div className="progress-bar">
      <Filler percentage={props.percentage} />
    </div>
  )
}

const Filler = (props) => {
  return <div className="filler" style={{ width: `${props.percentage}%` }}/>
}

export default Garage;
