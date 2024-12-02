// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Clear IndexedDB before each test file
beforeEach(() => {
  indexedDB.databases().then((databases) => {
    databases.forEach((database) => {
      indexedDB.deleteDatabase(database.name || 'messages');
    });
  });
});

// Clear IndexedDB after each test file
afterEach(() => {
  indexedDB.databases().then((databases) => {
    databases.forEach((database) => {
      indexedDB.deleteDatabase(database.name || 'messages');
    });
  });
});

// Prevent Cypress from failing tests when it encounters uncaught exceptions
Cypress.on('uncaught:exception', (err) => {
  // Handle Next.js hydration errors
  if (
    err.message?.includes('Hydration failed') ||
    err.message?.includes('There was an error while hydrating') ||
    err.message?.includes('Minified React error') ||
    err.message?.includes('Text content does not match server-rendered HTML') ||
    // Add other Next.js specific error messages you want to ignore
    err.message?.includes('Cannot read properties of null') ||
    err.message?.includes('ResizeObserver loop') ||
    err.message?.includes('Loading chunk') ||
    err.message?.includes('Failed to fetch')
  ) {
    return false;
  }

  // Log the error for debugging
  cy.log('Uncaught exception:', err.message);

  // Returning false prevents Cypress from failing the test
  return false;
});

// Handle unhandled promise rejections
Cypress.on('uncaught:exception:unhandled', (err) => {
  cy.log('Unhandled rejection:', err.message);
  return false;
});
