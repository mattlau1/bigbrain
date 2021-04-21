import { shallow } from 'enzyme';
import React from 'react';
import Lobby from './Lobby';

describe('Lobby', () => {
  it('should not render volume control', () => {
    const wrapper = shallow(<Lobby />);
    expect(wrapper.find('#volume-slider')).toHaveLength(0);
  })

  it('should render the lobby page', () => {
    expect(shallow(<Router><Lobby /></Router>)).toEqual({});
  })
})
