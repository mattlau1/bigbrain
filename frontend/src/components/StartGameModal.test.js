import { shallow } from 'enzyme';
import React from 'react';
import StartGameModal from './StartGameModal';
import renderer from 'react-test-renderer';

describe('Start Game Modal', () => {
  it('should render start game modal', () => {
    const tree = renderer.create(<StartGameModal />).toJSON();
    const wrapper = shallow(<StartGameModal />);
    expect(wrapper).toHaveLength(1);

    // ensure that there are no changes to the component after test
    // (before/after is the same)
    expect(tree).toMatchSnapshot();
  })

  it('should have texts on the modal', () => {
    const tree = renderer.create(<StartGameModal />).toJSON();
    const wrapper = shallow(<StartGameModal />);
    const text = wrapper.find('p');
    expect(text.text()).toBe('Your Session ID is...');

    // ensure that there are no changes to the component after test
    // (before/after is the same)
    expect(tree).toMatchSnapshot();
  })

  it('should have the copy button', () => {
    const tree = renderer.create(<StartGameModal />).toJSON();
    const wrapper = shallow(<StartGameModal />);
    const text = wrapper.find('#copy-button');
    expect(text.text()).toBe('Copy Session ID');

    // ensure that there are no changes to the component after test
    // (before/after is the same)
    expect(tree).toMatchSnapshot();
  })

  it('should have the join game button', () => {
    const tree = renderer.create(<StartGameModal />).toJSON();
    const wrapper = shallow(<StartGameModal />);
    const text = wrapper.find('#join-button');
    expect(text.text()).toBe('Join Game');

    // ensure that there are no changes to the component after test
    // (before/after is the same)
    expect(tree).toMatchSnapshot();
  })

  it('should have the close modal button', () => {
    const tree = renderer.create(<StartGameModal />).toJSON();
    const wrapper = shallow(<StartGameModal />);
    const text = wrapper.find('#close-button');
    expect(text.text()).toBe('Close');

    // ensure that there are no changes to the component after test
    // (before/after is the same)
    expect(tree).toMatchSnapshot();
  })

  it('should not appear without props', () => {
    const tree = renderer.create(<StartGameModal />).toJSON();
    const wrapper = shallow(<StartGameModal />);
    const button = wrapper.find('#close-button');
    button.simulate('click');
    const modal = shallow(<StartGameModal />);
    expect(modal).toHaveLength(1);

    // ensure that there are no changes to the component after test
    // (before/after is the same)
    expect(tree).toMatchSnapshot();
  })
})
