/// <reference types="cypress" />

describe('Happy Path', () => {
  it('should register a new user', () => {
    // function to generate a random string
    const generateUser = () => Cypress._.random(0, 1e7);
    const id = generateUser();

    // visit login page, go to register page
    cy.visit('/');
    cy.get('#registerBtn').click();

    // fill out registration form
    cy.get('#formBasicName').clear();
    cy.get('#formBasicName').type(id);
    cy.get('#formBasicEmail').clear();
    cy.get('#formBasicEmail').type(`${id}@gmail.com`);
    cy.get('#formBasicPassword').clear();
    cy.get('#formBasicPassword').type(id);
    cy.get('#formBasicConfirmPassword').clear();
    cy.get('#formBasicConfirmPassword').type(id);

    // register button
    cy.get('.w-75 > .mt-2').click();

    // we should now be on the dashboard
    cy.url().should('include', '/dashboard');
  });

  it('should create a new game', () => {
    // function to generate a random string
    const generateUser = () => Cypress._.random(0, 1e7);
    const id = generateUser();

    // visit login page, go to register page
    cy.visit('/');
    cy.get('#registerBtn').click();

    // fill out registration form
    cy.get('#formBasicName').clear();
    cy.get('#formBasicName').type(id);
    cy.get('#formBasicEmail').clear();
    cy.get('#formBasicEmail').type(`${id}@gmail.com`);
    cy.get('#formBasicPassword').clear();
    cy.get('#formBasicPassword').type(id);
    cy.get('#formBasicConfirmPassword').clear();
    cy.get('#formBasicConfirmPassword').type(id);

    // register button
    cy.get('.w-75 > .mt-2').click();

    // create a new game
    cy.get('#create-game-button').click();
    cy.get('#game-title-input').clear();
    cy.get('#game-title-input').type('Javascript');
    cy.get('#create-button').click();

    // check if the new game card exists in the DOM
    cy.get('#game-name').contains('Javascript').should('exist');
    cy.get('#num-questions').should('exist');
    cy.get('#game-length').should('exist');
  });

  it('should start a game', () => {
    // function to generate a random string
    const generateUser = () => Cypress._.random(0, 1e7);
    const id = generateUser();

    // visit login page, go to register page
    cy.visit('/');
    cy.get('#registerBtn').click();

    // fill out registration form
    cy.get('#formBasicName').clear();
    cy.get('#formBasicName').type(id);
    cy.get('#formBasicEmail').clear();
    cy.get('#formBasicEmail').type(`${id}@gmail.com`);
    cy.get('#formBasicPassword').clear();
    cy.get('#formBasicPassword').type(id);
    cy.get('#formBasicConfirmPassword').clear();
    cy.get('#formBasicConfirmPassword').type(id);

    // register button
    cy.get('.w-75 > .mt-2').click();

    // create a new game
    cy.get('#create-game-button').click();
    cy.get('#game-title-input').clear();
    cy.get('#game-title-input').type('Javascript');
    cy.get('#create-button').click();

    // check if the start button exists
    cy.get('.justify-content-between > :nth-child(1) > .mx-0').should('exist');

    // click the start button
    cy.get('.justify-content-between > :nth-child(1) > .mx-0').click();

    // check if the share/invite button exists
    cy.get('#share-btn').should('exist');
    cy.get('#share-btn').click();

    // check if the start game/advance question button exists
    // in admin control panel
    cy.get('#start-advance-btn').should('exist');
    cy.get('#start-advance-btn').click();
  });

  it('should end a game', () => {
    // function to generate a random string
    const generateUser = () => Cypress._.random(0, 1e7);
    const id = generateUser();

    // visit login page, go to register page
    cy.visit('/');
    cy.get('#registerBtn').click();

    // fill out registration form
    cy.get('#formBasicName').clear();
    cy.get('#formBasicName').type(id);
    cy.get('#formBasicEmail').clear();
    cy.get('#formBasicEmail').type(`${id}@gmail.com`);
    cy.get('#formBasicPassword').clear();
    cy.get('#formBasicPassword').type(id);
    cy.get('#formBasicConfirmPassword').clear();
    cy.get('#formBasicConfirmPassword').type(id);

    // register button
    cy.get('.w-75 > .mt-2').click();

    // create a new game
    cy.get('#create-game-button').click();
    cy.get('#game-title-input').clear();
    cy.get('#game-title-input').type('Javascript');
    cy.get('#create-button').click();

    // click the start button
    cy.get('.justify-content-between > :nth-child(1) > .mx-0').click();

    // check if the share/invite button exists
    cy.get('#share-btn').click();

    // check if the start game/advance question button exists
    // in admin control panel
    cy.get('#start-advance-btn').click();

    // close modal (admin control panel/share modal)
    cy.get('.modal-footer > .btn').click();

    // click stop button
    cy.get('#stopgame-btn').should('exist');
    cy.get('#stopgame-btn').click();

    // game completed modal appearance, check for existence of its components
    cy.get('.modal-title').contains('Completed').should('exist');
    cy.get('.modal-body > .text-center').contains('results').should('exist');

    // close modal
    cy.get('.modal-footer > .btn').click();

    // previous games existence
    cy.get('.dropdown-toggle').should('exist');
    cy.get('.dropdown-toggle').click();
    cy.get('.dropdown-item').should('exist');
  });

  it('should display the results screen', () => {
    // function to generate a random string
    const generateUser = () => Cypress._.random(0, 1e7);
    const id = generateUser();

    // visit login page, go to register page
    cy.visit('/');
    cy.get('#registerBtn').click();

    // fill out registration form
    cy.get('#formBasicName').clear();
    cy.get('#formBasicName').type(id);
    cy.get('#formBasicEmail').clear();
    cy.get('#formBasicEmail').type(`${id}@gmail.com`);
    cy.get('#formBasicPassword').clear();
    cy.get('#formBasicPassword').type(id);
    cy.get('#formBasicConfirmPassword').clear();
    cy.get('#formBasicConfirmPassword').type(id);

    // register button
    cy.get('.w-75 > .mt-2').click();

    // create a new game
    cy.get('#create-game-button').click();
    cy.get('#game-title-input').clear();
    cy.get('#game-title-input').type('Javascript');
    cy.get('#create-button').click();

    // click the start button
    cy.get('.justify-content-between > :nth-child(1) > .mx-0').click();

    // check if the share/invite button exists
    cy.get('#share-btn').click();

    // check if the start game/advance question button exists
    // in admin control panel
    cy.get('#start-advance-btn').click();

    // close modal (admin control panel/share modal)
    cy.get('.modal-footer > .btn').click();

    // click stop button
    cy.get('#stopgame-btn').click();

    // view results button
    cy.get('#view-results-btn').should('exist');
    cy.get('#view-results-btn').click();

    // we should now be on the results screen
    cy.url().should('include', '/results');

    // check if results page heading exists
    cy.get('.mb-0').contains('Results').should('exist');
  });

  it('should log out a user', () => {
    // function to generate a random string
    const generateUser = () => Cypress._.random(0, 1e7);
    const id = generateUser();

    // visit login page, go to register page
    cy.visit('/');
    cy.get('#registerBtn').click();

    // fill out registration form
    cy.get('#formBasicName').clear();
    cy.get('#formBasicName').type(id);
    cy.get('#formBasicEmail').clear();
    cy.get('#formBasicEmail').type(`${id}@gmail.com`);
    cy.get('#formBasicPassword').clear();
    cy.get('#formBasicPassword').type(id);
    cy.get('#formBasicConfirmPassword').clear();
    cy.get('#formBasicConfirmPassword').type(id);

    // register button
    cy.get('.w-75 > .mt-2').click();

    // create a new game
    cy.get('#create-game-button').click();
    cy.get('#game-title-input').clear();
    cy.get('#game-title-input').type('Javascript');
    cy.get('#create-button').click();

    // click the start button
    cy.get('.justify-content-between > :nth-child(1) > .mx-0').click();

    // check if the share/invite button exists
    cy.get('#share-btn').click();

    // check if the start game/advance question button exists
    // in admin control panel
    cy.get('#start-advance-btn').click();

    // close modal (admin control panel/share modal)
    cy.get('.modal-footer > .btn').click();

    // click stop button
    cy.get('#stopgame-btn').click();

    // click results button
    cy.get('#view-results-btn').click();

    // log out
    cy.get('#logout-btn').should('exist');
    cy.get('#logout-btn').click();

    // check if we are on login screen
    cy.url().should('equal', 'http://localhost:3000/');
  });

  it('should allow a user to log back in', () => {
    // function to generate a random string
    const generateUser = () => Cypress._.random(0, 1e7);
    const id = generateUser();

    // visit login page, go to register page
    cy.visit('/');
    cy.get('#registerBtn').click();

    // fill out registration form
    cy.get('#formBasicName').clear();
    cy.get('#formBasicName').type(id);
    cy.get('#formBasicEmail').clear();
    cy.get('#formBasicEmail').type(`${id}@gmail.com`);
    cy.get('#formBasicPassword').clear();
    cy.get('#formBasicPassword').type(id);
    cy.get('#formBasicConfirmPassword').clear();
    cy.get('#formBasicConfirmPassword').type(id);

    // register button
    cy.get('.w-75 > .mt-2').click();

    // create a new game
    cy.get('#create-game-button').click();
    cy.get('#game-title-input').clear();
    cy.get('#game-title-input').type('Javascript');
    cy.get('#create-button').click();

    // click the start button
    cy.get('.justify-content-between > :nth-child(1) > .mx-0').click();

    // check if the share/invite button exists
    cy.get('#share-btn').click();

    // check if the start game/advance question button exists
    // in admin control panel
    cy.get('#start-advance-btn').click();

    // close modal (admin control panel/share modal)
    cy.get('.modal-footer > .btn').click();

    // click stop button
    cy.get('#stopgame-btn').click();

    // click results button
    cy.get('#view-results-btn').click();

    // log out
    cy.get('#logout-btn').should('exist');
    cy.get('#logout-btn').click();

    // check if we are on login screen
    cy.get('#formBasicemail').clear();
    cy.get('#formBasicemail').type(`${id}@gmail.com`);
    cy.get('#formBasicPassword').clear();
    cy.get('#formBasicPassword').type(id);
    cy.get('.w-100 > .mt-2').click();

    // check if we are on dashboard screen
    cy.url().should('include', '/dashboard');
  });
})
