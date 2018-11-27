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
    garage.garage[0].spotAval = [];
    garage.garage[0].floorAval = [0, 0, 0, 0];

    occupied[garage.garage[0].name] =  0;
    for(var j = 0; j < garage.garage[0].sensors.length; j++) {
      const sensor = (await axios.get(`https://murmuring-waters-47073.herokuapp.com/sensor/${garage.garage[0].sensors[j]}`)).data;
      //array[sensor.sensor[0].floor - 1] += sensor.sensor[0].cars;
      if(sensor.sensor.length > 0) {
        var count = sensor.sensor[0].cars;
        garage.garage[0].spotAval.push(sensor.sensor[0].spots);
        occupied[garage.garage[0].name] += count;
        garage.garage[0].floorAval[sensor.sensor[0].floor - 1] += count;
      }
    }
    garage.garage[0].occupied = occupied[garage.garage[0].name];

    console.log(garage.garage[0].floorAval)
    garage.garage[0].floorC = 1;

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
            <h5 className="display-3" style={{fontSize: 40 + 'px'}}>Parking Garage {garage.garage[0].name}</h5>
            <p className="lead"></p>
            <hr className="my-4" />
            <p style={{fontSize: 20 + 'px'}}>{garage.garage[0].totalSpots - garage.garage[0].occupied} remaining spots out of {garage.garage[0].totalSpots}</p>
            <div>
              Garage Occupancy : {Math.floor((garage.garage[0].occupied/garage.garage[0].totalSpots) * 100)}%
              <br></br>
              <ProgressBar percentage={Math.floor((garage.garage[0].occupied/garage.garage[0].totalSpots) * 100)} />
              <br></br>
            </div>

            <div>
            {
              garage.garage[0].floorAval.map(floorCount => (
                <p>Floor {garage.garage[0].floorC++} : {floorCount}/{Math.ceil(garage.garage[0].totalSpots/4)}</p>
              ))
            }
            </div>

            <hr className="my-4" />
            <p><b>Spot Availability</b></p>
            <div>
            {
              garage.garage[0].spotAval.map(spots => (
                spots.map(spot => (
                  <p>Spot {spot.spotID}: {
                    spot.occupied ?
                      (<p>Occupied</p>) : (<p>Available</p>)
                  } </p>
                ))
              ))
            }
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
