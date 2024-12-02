describe('Performance', () => {
  it('should load initial page quickly', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.performance.mark('start-load');
      },
    });

    cy.window().then((win) => {
      win.performance.mark('end-load');
      const measure = win.performance.measure('page-load', 'start-load', 'end-load');
      expect(measure.duration).to.be.lessThan(3000); // 3s threshold
    });
  });

  it('should handle rapid message sending', () => {
    cy.visit('/');
    for (let i = 0; i < 5; i++) {
      cy.get('textarea').type(`Quick message ${i}{enter}`);
    }
    cy.get('[data-testid="user-message"]').should('have.length', 5);
  });

  it('should maintain performance with many messages', () => {
    cy.visit('/');
    // Generate 20 message pairs
    for (let i = 0; i < 20; i++) {
      cy.get('textarea').type(`Message ${i}{enter}`);
      cy.get('[data-testid="assistant-message"]', { timeout: 10000 }).should('exist');
    }
    // Check scroll performance
    cy.get('[data-testid="messages-container"]').scrollTo('top', { duration: 500 });
  });
});
