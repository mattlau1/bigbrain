import { shallow } from 'enzyme';
import React from 'react';
import CreateGameModal from './CreateGameModal';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Create Game Modal', () => {
  it('should render create game modal component', () => {
    const tree = renderer.create(<Router><CreateGameModal /></Router>).toJSON();
    const wrapper = shallow(<CreateGameModal />);
    expect(wrapper).toHaveLength(1);
    expect(tree).toMatchSnapshot();
  })

  it('should have the close button', () => {
    const tree = renderer.create(<Router><CreateGameModal /></Router>).toJSON();
    const wrapper = shallow(<CreateGameModal />);
    const text = wrapper.find('#close-button');
    expect(text.text()).toBe('Close');
    expect(tree).toMatchSnapshot();
  })

  it('should have the create game button', () => {
    const tree = renderer.create(<Router><CreateGameModal /></Router>).toJSON();
    const wrapper = shallow(<CreateGameModal />);
    const text = wrapper.find('#create-button');
    expect(text.text()).toBe('Create Game');
    expect(tree).toMatchSnapshot();
  })

  it('should have the text input box', () => {
    const tree = renderer.create(<Router><CreateGameModal /></Router>).toJSON();
    const wrapper = shallow(<CreateGameModal />);
    expect(wrapper.find('#game-title-input')).toHaveLength(1);
    expect(tree).toMatchSnapshot();
  })

  it('should have any text if modal is not on display', () => {
    const tree = renderer.create(<Router><CreateGameModal /></Router>).toJSON();
    const wrapper = shallow(<CreateGameModal />);
    wrapper.find('#game-title-input');
    wrapper.simulate('change', { target: { value: 'A new game' } })
    const text = wrapper.find('#game-title-input');
    expect(text.text()).toBe('');
    expect(tree).toMatchSnapshot();
  })
})
