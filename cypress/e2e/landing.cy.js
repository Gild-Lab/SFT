describe('Landing page', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    })
    beforeEach(() => {
        cy.visit('/')
    })
    it('should show landing page', () => {
        cy.get(`.landing-container`).should('exist');
    });
})