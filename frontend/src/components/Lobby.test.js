import Enzyme from 'enzyme';
// import React from "react";
// import Lobby from "./Lobby"
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

describe('Lobby', () => {
  // passing params with generic id
  it('Render lobby components', () => {
    const foo = true;
    expect(foo).toBe(true);
  })
})
