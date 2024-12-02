describe('Chat Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should send a message and receive a response', () => {
    cy.get('textarea').type('Hello{enter}');
    cy.getByTestId('user-message').should('contain', 'Hello');
    cy.getByTestId('assistant-message', { timeout: 10000 }).should('exist');
  });

  it('should persist messages after reload', () => {
    const message = 'Test persistence';
    cy.get('textarea').type(`${message}{enter}`);
    cy.getByTestId('user-message').should('contain', message);
    cy.getByTestId('assistant-message', { timeout: 10000 }).should('exist');

    cy.reload();
    cy.getByTestId('user-message').should('contain', message);
  });

  it('should handle offline mode', () => {
    // Go offline
    cy.window().then((win) => {
      cy.stub(win.navigator, 'onLine').value(false);
      win.dispatchEvent(new Event('offline'));
    });

    cy.get('textarea').type('Offline message{enter}');
    cy.contains('You are offline').should('be.visible');

    // Go back online
    cy.window().then((win) => {
      cy.stub(win.navigator, 'onLine').value(true);
      win.dispatchEvent(new Event('online'));
    });
    cy.contains('Back online').should('be.visible');
  });
});
