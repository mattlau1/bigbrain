import { shallow, mount } from 'enzyme';
import React from 'react';
import Navigation from './Navigation';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Navigation', () => {
  it('should display BigBrain as the brand', () => {
    const tree = renderer.create(<Router><Navigation /></Router>).toJSON();
    const wrapper = shallow(<Navigation />);

    expect(wrapper).toHaveLength(1);

    // console.log(wrapper.find('.brand-name').debug())

    const text = wrapper.find('#brand-name');
    expect(text).toHaveLength(1);

    expect(text.text()).toBe('BigBrain');

    expect(tree).toMatchSnapshot();
  })

  it('should display BigBrain as the brand', () => {
    const tree = renderer.create(<Router><Navigation /></Router>).toJSON();
    const wrapper = shallow(<Navigation />);

    expect(wrapper).toHaveLength(1);

    // console.log(wrapper.find('.brand-name').debug())

    const button = wrapper.find('#dashboard-link');
    expect(button).toHaveLength(1);

    expect(button.hasClass('active')).toBeFalsy();

    button.simulate('click');

    expect(button.hasClass('active')).toBeTruthy();

    expect(tree).toMatchSnapshot();
  })
})
