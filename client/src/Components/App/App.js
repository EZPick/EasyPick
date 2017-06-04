import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import Home from '../Home/Home';
import Create from '../Create/Create';
import Respond from '../Respond/Respond';
import Meeting from '../Meeting/Meeting';
import './App.css';

class App extends Component {
  componentDidMount() {
    //fetch('/api/meeting/1')
      //.then(res => res.json())
      //.then(meeting => this.setState({ meeting }));
  }

  render() {
    return (
      <div>
        <div className="header clearfix">
          <h3 className="text-muted">EasyPick</h3>
        </div>
        <Router className="App">
          <div>
            <Route exact path="/" component={Home}/>
            <Route exact path="/create" component={Create}/>
            <Route path="/respond/:id" component={Respond}/>
            <Route path="/meeting/:id" component={Meeting}/>
          </div>
        </Router>
        <footer className="footer">
          <p>&copy; 2017 EasyPick, Inc.</p>
        </footer>
      </div>
    );
  }
}

export default App;
