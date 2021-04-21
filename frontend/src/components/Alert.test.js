import { shallow } from 'enzyme';
import React from 'react';
import Alert from './Alert.js';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Alert', () => {
  it('should show a successful alert with the right message', () => {
    const tree = renderer.create(<Router><Alert /></Router>).toJSON();
    const wrapper = shallow(<Alert type='SUCCESS' message='This is a success'/>);
    const text = wrapper.find('div p');
    expect(text.text()).toBe('This is a success');
    expect(tree).toMatchSnapshot();
  })

  it('should show an unsuccessful alert with the right message', () => {
    const tree = renderer.create(<Router><Alert /></Router>).toJSON();
    const wrapper = shallow(<Alert type='ERROR' message='This is an error'/>);
    const text = wrapper.find('div p');
    expect(text.text()).toBe('This is an error');
    expect(tree).toMatchSnapshot();
  })

  it('should show a successful alert', () => {
    const tree = renderer.create(<Router><Alert /></Router>).toJSON();
    const wrapper = shallow(<Alert type='SUCCESS' message='Cat says meow'/>);
    expect(wrapper.hasClass('success')).toBe(true);
    expect(wrapper.hasClass('error')).toBe(false);
    expect(tree).toMatchSnapshot();
  })

  it('should show an unsuccessful alert', () => {
    const tree = renderer.create(<Router><Alert /></Router>).toJSON();
    const wrapper = shallow(<Alert type='ERROR' message='Dog says woof'/>);
    expect(wrapper.hasClass('success')).toBe(false);
    expect(wrapper.hasClass('error')).toBe(true);
    expect(tree).toMatchSnapshot();
  })

  it('should try to exit after 4 seconds', () => {
    const wrapper = shallow(<Alert type='SUCCESS' message='Hello world'/>);

    // alert should apply a class 'exit' to itself and remove itself from
    // the dom after 4 seconds have passed
    setTimeout(() => {
      expect(wrapper.hasClass('exit')).toEqual(true);
    }, 4000);
  })

  it('should be closed after 4 seconds', () => {
    const wrapper = shallow(<Alert type='SUCCESS' message='Hello'/>);
    setTimeout(() => {
      expect(wrapper.exists()).toBeFalsy();
    }, 5001);
  })
});
