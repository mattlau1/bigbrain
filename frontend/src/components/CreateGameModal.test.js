import { shallow } from 'enzyme';
import React from 'react';
import CreateGameModal from './CreateGameModal';
import renderer from 'react-test-renderer';

describe('Create Game Modal', () => {
  it('should render create game modal component', () => {
    const tree = renderer.create(<CreateGameModal />).toJSON();
    const wrapper = shallow(<CreateGameModal />);
    expect(wrapper).toHaveLength(1);

    // ensure that there are no changes to the component after test
    // (before/after is the same)
    expect(tree).toMatchSnapshot();
  })

  it('should have the close button', () => {
    const tree = renderer.create(<CreateGameModal />).toJSON();
    const wrapper = shallow(<CreateGameModal />);
    const text = wrapper.find('#close-button');
    expect(text.text()).toBe('Close');

    // ensure that there are no changes to the component after test
    // (before/after is the same)
    expect(tree).toMatchSnapshot();
  })

  it('should have the create game button', () => {
    const tree = renderer.create(<CreateGameModal />).toJSON();
    const wrapper = shallow(<CreateGameModal />);
    const text = wrapper.find('#create-button');
    expect(text.text()).toBe('Create Game');

    // ensure that there are no changes to the component after test
    // (before/after is the same)
    expect(tree).toMatchSnapshot();
  })

  it('should have the text input box', () => {
    const tree = renderer.create(<CreateGameModal />).toJSON();
    const wrapper = shallow(<CreateGameModal />);
    expect(wrapper.find('#game-title-input')).toHaveLength(1);

    // ensure that there are no changes to the component after test
    // (before/after is the same)
    expect(tree).toMatchSnapshot();
  })

  it('should have any text if modal is not on display', () => {
    const tree = renderer.create(<CreateGameModal />).toJSON();
    const wrapper = shallow(<CreateGameModal />);
    wrapper.find('#game-title-input');
    wrapper.simulate('change', { target: { value: 'A new game' } })
    const text = wrapper.find('#game-title-input');
    expect(text.text()).toBe('');

    // ensure that there are no changes to the component after test
    // (before/after is the same)
    expect(tree).toMatchSnapshot();
  })
})
