import { shallow } from 'enzyme';
import React from 'react';
import StopGameModal from './StopGameModal';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Stop Game Modal', () => {
  it('should render stop game modal', () => {
    const tree = renderer.create(<Router><StopGameModal /></Router>).toJSON();
    const wrapper = shallow(<StopGameModal />);
    expect(wrapper).toHaveLength(1);
    expect(tree).toMatchSnapshot();
  })

  it('should have the question text', () => {
    const tree = renderer.create(<Router><StopGameModal /></Router>).toJSON();
    const wrapper = shallow(<StopGameModal />);
    const text = wrapper.find('h4');
    expect(text.text()).toBe('Would you like to view the results?');
    expect(tree).toMatchSnapshot();
  })

  it('should have the yes button', () => {
    const tree = renderer.create(<Router><StopGameModal /></Router>).toJSON();
    const wrapper = shallow(<StopGameModal />);
    const text = wrapper.find('#view-results-btn');
    expect(text.text()).toBe('Yes');
    expect(tree).toMatchSnapshot();
  })

  it('should have the no button', () => {
    const tree = renderer.create(<Router><StopGameModal /></Router>).toJSON();
    const wrapper = shallow(<StopGameModal />);
    const text = wrapper.find('#no-click');
    expect(text.text()).toBe('No');
    expect(tree).toMatchSnapshot();
  })

  it('should have the close button', () => {
    const tree = renderer.create(<Router><StopGameModal /></Router>).toJSON();
    const wrapper = shallow(<StopGameModal />);
    const text = wrapper.find('#close-button');
    expect(text.text()).toBe('Close');
    expect(tree).toMatchSnapshot();
  })

  it('should not appear without props', () => {
    const tree = renderer.create(<Router><StopGameModal /></Router>).toJSON();
    const wrapper = shallow(<StopGameModal />);
    const button = wrapper.find('#close-button');
    button.simulate('click');
    const modal = shallow(<StopGameModal />);
    expect(modal).toHaveLength(1);
    expect(tree).toMatchSnapshot();
  })
})
