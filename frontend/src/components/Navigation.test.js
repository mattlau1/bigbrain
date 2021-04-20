import Enzyme, { mount, shallow } from 'enzyme';
import React from 'react';
import Navigation from './Navigation'
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

describe('Navigation', () => {
  // get the title of the app
  it('render navbar components', () => {
    shallow(<Navigation />);
  })

  it('Get brand title', () => {
    const wrapper = mount(<Navigation />);
    const text = wrapper.find('Brand').debug();
    expect(text.text()).toBe('Big Brain');
  })
})
