import { shallow } from 'enzyme';
import React from 'react';
import Navigation from './Navigation';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Navigation', () => {
  it('should display BigBrain as the brand', () => {
    const tree = renderer.create(<Router><Navigation /></Router>).toJSON();
    const wrapper = shallow(<Navigation />);
    expect(wrapper).toHaveLength(1);
    const text = wrapper.find('#brand-name');
    expect(text).toHaveLength(1);
    expect(text.text()).toBe('BigBrain');
    expect(tree).toMatchSnapshot();
  })

  it('should not have a collapsed navbar button', () => {
    const tree = renderer.create(<Router><Navigation /></Router>).toJSON();
    const wrapper = shallow(<Navigation />);
    const navbar = wrapper.find('#nav-button');
    expect(navbar.hasClass('navbar-toggler collapsed')).toBeFalsy();
    expect(wrapper.find('.show')).toHaveLength(0);
    expect(tree).toMatchSnapshot();
  })

  it('should have dashboard button', () => {
    const tree = renderer.create(<Router><Navigation /></Router>).toJSON();
    const wrapper = shallow(<Navigation />);
    const text = wrapper.find('#dashboard-btn');
    expect(text.text()).toBe('Dashboard');
    expect(tree).toMatchSnapshot();
  })

  it('should have signout button', () => {
    const tree = renderer.create(<Router><Navigation /></Router>).toJSON();
    const wrapper = shallow(<Navigation />);
    const text = wrapper.find('#logout-btn');
    expect(text.text()).toBe('Sign Out');
    expect(tree).toMatchSnapshot();
  })
})
