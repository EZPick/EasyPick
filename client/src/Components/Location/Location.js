import React, { Component } from 'react';
import './Location.css';

class Location extends Component {

  constructor(props) {
    super(props);
    this.state = {wifi: false, privacy: false, quiet: false, foodAndDrink: false};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: !this.state[event.target.id]
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div ref="form-group">
        <label>Location Preferences</label>
        <form ref="form" onSubmit={this.handleSubmit}>
          <table>
            <tbody>
              <tr>
                <label className="form-item">
                  Wifi
                  <input id="wifi" type="checkbox" className="locationCheckBox" onChange={this.handleChange} />
                </label>
                <label className="form-item">
                  Privacy
                  <input id="privacy" type="checkbox" className="locationCheckBox" onChange={this.handleChange} />
                </label>
                <label className="form-item">
                  Quiet
                  <input id="quiet" type="checkbox" className="locationCheckBox" onChange={this.handleChange} />
                </label>
                <label className="form-item">
                  Food and Drink
                  <input id="foodAndDrink" type="checkbox" className="locationCheckBox" onChange={this.handleChange} />
                </label>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }

  value() {
    // get the value? not sure why we need this?
  }
}

export default Location;
