import React, { Component } from 'react';
import './Location.css';

class Location extends Component {

  constructor(props) {
    super(props);
    this.state = {wifi: '', privacy: '', quiet: '', foodAndDrink: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({wifi: event.target.wifi});
    this.setState({privacy: event.target.privacy});
    this.setState({quiet: event.target.quiet});
    this.setState({foodAndDrink: event.target.foodAndDrink});
    this.setState({parking: event.target.parking});
    this.setState({parking: event.target.busLines});
    this.setState({openLate: event.target.openLate});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.coffee);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <table>
            <tr className="odd">
              <td>
                <label className="item">
                  <input id="wifi" type="checkbox" value={this.state.wifi} onChange={this.handleChange} /> Wifi
                </label>
              </td>
              <td>
                <label className="item">
                  <input id="privacy" type="checkbox" value={this.state.privacy} onChange={this.handleChange} /> Privacy
                </label>
              </td>
              <td>
                <label className="item">
                  <input id="quiet" type="checkbox" value={this.state.quiet} onChange={this.handleChange} /> Quiet
                </label>
              </td>
              <td>
                <label className="item">
                  <input id="foodAndDrink" type="checkbox" value={this.state.foodAndDrink} onChange={this.handleChange} /> Food and Drink
                </label>
              </td>
            </tr>

            <tr className="even">
              <td>
                <label className="item">
                  <input id="parking" type="checkbox" value={this.state.parking} onChange={this.handleChange} /> Parking
                </label>
              </td>
              <td>
                <label className="item">
                  <input id="busLines" type="checkbox" value={this.state.busLines} onChange={this.handleChange} /> Close to Bus
                </label>
              </td>
              <td>
                <label className="item">
                  <input id="openLate" type="checkbox" value={this.state.openLate} onChange={this.handleChange} /> Open Late
                </label>
              </td>
            </tr>
          </table>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }

  value() {
    // get the value
  }
}

export default Location;
