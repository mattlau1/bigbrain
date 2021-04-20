import Enzyme, { shallow } from 'enzyme';
import React from "react";
// import renderer from 'react-test-renderer';
import Alert from "./Alert.js";
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

describe('Alert', () => {

    // making success alert
    it('Standard success alert', () => {
        const wrapper = shallow(<Alert type='SUCCESS' message='This is a success'/>);
        const text = wrapper.find('div p');
        expect(text.text()).toBe('This is a success');
    })

    // making error alert
    it('Standard error alert', () => {
        const wrapper = shallow(<Alert type='ERROR' message='This is an error'/>);
        const text = wrapper.find('div p');
        expect(text.text()).toBe('This is an error');
    })

    // customiszed text with success
    it('custom text success', () => {
        const wrapper = shallow(<Alert type='SUCCESS' message='Cat says meow'/>);
        const text = wrapper.find('div p');
        expect(text.text()).toBe('Cat says meow');
    })

    // customised text with error
    it('custom text error', () => {
        const wrapper = shallow(<Alert type='ERROR' message='Dog says woof'/>);
        const text = wrapper.find('div p');
        expect(text.text()).toBe('Dog says woof');
    })

    // passing in random type
    it('custom type error', () => {
        const wrapper = shallow(<Alert type='randomtype' message='becomes an error'/>);
        const text = wrapper.find('div p');
        expect(text.text()).toBe('becomes an error');
    })
});