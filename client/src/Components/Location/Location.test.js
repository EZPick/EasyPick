import React from 'react';
import ReactDOM from 'react-dom';
import Location from './Location';
import ReactTestUtils from 'react-dom/test-utils';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Location />, div);
});

/*refs.wifi;
const privacyBox = this.refs.privacy;
const quietBox = this.refs.quiet;
const foodAndDrinkBox = this.refs.foodAndDrink;
const parkingBox = this.refs.parking;
const busBox = this.refs.busLines;
const openLateBox = this.refs.openLate;

ReactTestUtils.Simulate.click(wifiBox);
ReactTestUtils.Simulate.click(privacyBox);
ReactTestUtils.Simulate.click(quietBox);
ReactTestUtils.Simulate.click(foodAndDrinkBox);
ReactTestUtils.Simulate.click(parkingBox);
ReactTestUtils.Simulate.click(busBox);
ReactTestUtils.Simulate.click(openLateBox);

const form = this.refs.form;
const div = this.refs.outputDiv;

isDOMComponent(form);
isDOMComponent(div);
*/
