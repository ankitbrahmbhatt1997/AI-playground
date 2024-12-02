describe('UI Responsiveness', () => {
  const sizes: (Cypress.ViewportPreset | [number, number])[] = [
    'iphone-6',
    'ipad-2',
    [1024, 768],
  ] as const;

  sizes.forEach((size) => {
    it(`should be responsive on ${size} screen`, () => {
      if (Array.isArray(size)) {
        cy.viewport(size[0], size[1]);
      } else {
        cy.viewport(size as Cypress.ViewportPreset);
      }

      cy.visit('/');
      cy.getByTestId('chat-input').should('be.visible');
      cy.get('button').contains('Send').should('be.visible');
      cy.getByTestId('online-status').should('be.visible');
    });
  });

  it('should handle text overflow in messages', () => {
    cy.visit('/');
    const longText = 'a'.repeat(1000);
    cy.get('textarea').type(`${longText}{enter}`);
    cy.getByTestId('user-message').should('be.visible');
  });
});
