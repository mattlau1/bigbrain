import { shallow } from 'enzyme';
import React from 'react';
import Lobby from './Lobby';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Lobby', () => {
  it('should not render volume control', () => {
    const tree = renderer.create(<Router><Lobby /></Router>).toJSON();
    const wrapper = shallow(<Router><Lobby /></Router>);
    expect(wrapper.find('#volume-slider')).toHaveLength(0);

    // ensure that there are no changes to the component after test
    // (before/after is the same)
    expect(tree).toMatchSnapshot();
  })

  it('should render the lobby page', () => {
    expect(shallow(<Router><Lobby /></Router>)).toEqual({});
  })
})
