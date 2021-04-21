/// <reference types="cypress" />

describe('BigBrain', () => {
  it('should work for the "happy path" of an admin', () => {
    const generateUser = () => Cypress._.random(0, 1e7);
    const id = generateUser();

    // ============== Registers successfully ============== //

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

    // click register button
    cy.get('.w-75 > .mt-2').click();

    // we should now be on the dashboard
    cy.url().should('include', '/dashboard');

    // ============== Creates a new game successfully ============== //

    // create a new game
    cy.get('#create-game-button').click();
    cy.get('#game-title-input').clear();
    cy.get('#game-title-input').type('Javascript');
    cy.get('#create-button').click();

    // add new question
    cy.get('#edit-game-btn').click();
    cy.url().should('include', '/edit');
    cy.get('#add-question-btn').click();
    cy.get('#confirm-changes-btn').click();
    cy.get('#add-question-btn').click();
    cy.get('#confirm-changes-btn').click();

    // go back to dashboard
    cy.get('#dashboard-btn').click();

    // ============== Starts a game successfully ============== //

    // check if the new game card exists in the DOM
    cy.get('#game-name').contains('Javascript').should('exist');
    cy.get('#num-questions').should('exist');
    cy.get('#game-length').should('exist');

    // click start button if it exists
    cy.get('.justify-content-between > :nth-child(1) > .mx-0').should('exist');
    cy.get('.justify-content-between > :nth-child(1) > .mx-0').click();

    // click on share/invite button
    cy.get('#share-btn').should('exist');
    cy.get('#share-btn').click();

    // click the start game/advance question button if it exists
    cy.get('#start-advance-btn').should('exist');
    cy.get('#start-advance-btn').click();

    // close modal (admin control panel/share modal)
    cy.get('.modal-footer > .btn').click();

    // ============== Ends a game successfully ============== //

    // click stop button
    cy.get('#stopgame-btn').should('exist');
    cy.get('#stopgame-btn').click();

    // check for game completed modal components
    cy.get('.modal-title').contains('Completed').should('exist');
    cy.get('.modal-body > .text-center').contains('results').should('exist');

    // ============== Loads the results page successfully ============== //

    // view results button
    cy.get('#view-results-btn').should('exist');
    cy.get('#view-results-btn').click();

    // we should now be on the results screen
    cy.url().should('include', '/results');

    // check if results page heading exists
    cy.get('.mb-0').contains('Results').should('exist');

    // go back to dashboard
    cy.get('#dashboard-btn').click();

    // previous games existence
    cy.get('.dropdown-toggle').should('exist');
    cy.get('.dropdown-toggle').click();
    cy.get('.dropdown-item').should('exist');
    cy.get('.dropdown-toggle').click();

    // ============== Logs out of the application successfully ============== //

    // log out
    cy.get('#logout-btn').should('exist');
    cy.get('#logout-btn').click();

    // check if we are on login screen
    cy.url().should('equal', 'http://localhost:3000/');

    // ============== Logs back into the application successfully ============== //

    // log back in
    cy.get('#formBasicemail').clear();
    cy.get('#formBasicemail').type(`${id}@gmail.com`);
    cy.get('#formBasicPassword').clear();
    cy.get('#formBasicPassword').type(id);
    cy.get('.w-100 > .mt-2').click();

    // check if we are on dashboard screen
    cy.url().should('include', '/dashboard');
  });
})
