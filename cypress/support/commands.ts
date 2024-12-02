/// <reference types="cypress" />

interface GetByTestIdOptions
  extends Cypress.Loggable,
    Cypress.Timeoutable,
    Cypress.Withinable,
    Cypress.Shadow {}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-testid attribute.
       * @example cy.getByTestId('greeting')
       */
      getByTestId(
        testId: string,
        options?: Partial<GetByTestIdOptions>
      ): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to select DOM elements that contain the testId in their data-testid attribute.
       * @example cy.getByTestIdLike('message')
       */
      getByTestIdLike(testId: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

// Get exact data-testid match
Cypress.Commands.add('getByTestId', (testId: string, options = {}) => {
  return cy.get(`[data-testid="${testId}"]`, options);
});

// Get partial data-testid match
Cypress.Commands.add('getByTestIdLike', (testId: string) => {
  return cy.get(`[data-testid*="${testId}"]`);
});

export {};
