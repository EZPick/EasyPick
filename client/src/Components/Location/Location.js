import React, { Component } from 'react';
import './Location.css';

class Location extends Component {

  constructor(props) {
    super(props);
    this.state = {coffee: '', tea: '', fastFood: '', quiet: '', sitDown: '', library: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({coffee: event.target.coffee});
    this.setState({tea: event.target.tea});
    this.setState({fastFood: event.target.fastFood});
    this.setState({quiet: event.target.quiet});
    this.setState({library: event.target.library});
    this.setState({sitDown: event.target.sitDown});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.coffee);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Coffee: <input id="coffee" type="checkbox" value={this.state.coffee} onChange={this.handleChange} />
            Tea: <input id="tea" type="checkbox" value={this.state.tea} onChange={this.handleChange} />
            Fast Food: <input id="fastFood" type="checkbox" value={this.state.fastFood} onChange={this.handleChange} />
            Quiet: <input id="quiet" type="checkbox" value={this.state.quiet} onChange={this.handleChange} />
            Library: <input id="" type="checkbox" value={this.state.library} onChange={this.handleChange} />
            Sit Down Restaurant: <input id="sitDown" type="checkbox" value={this.state.sitDown} onChange={this.handleChange} />

            <input type="submit" value="Submit" />
          </label>
        </form>
      </div>
    );
  }

  value() {
    // get the value
  }
}

export default Location;
