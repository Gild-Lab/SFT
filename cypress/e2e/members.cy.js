describe('Members page', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    })
    beforeEach(() => {
        cy.visit('/#')
        cy.get(`#launch-button`).click();

        cy.get(`#token-name-Sepolia-test`).click();
        cy.url().should('include', '/#token-overview')
    })
    it('should be navigated to members', () => {
        cy.get(`.path-members`).click();
        cy.url().should('include', '/#members')
    });
    it('Should check page title exists', () => {
        cy.get(`.path-members`).click();
        cy.get(`#members`).should('exist')
    });
    it('Update tier button should exist', () => {
        cy.get(`.path-members`).click();
        cy.get(`.update-tier-erc20`).should('exist')
    });
    it('Update tier button should exist', () => {
        cy.get(`.path-members`).click();
        cy.get(`.update-tier-erc1155`).should('exist')
    });
    it('Should check update tier buttons does not exits if no role', () => {
        cy.get(`.path-list`).click();
        cy.get(`#token-name-New-Project`).click();
        cy.wait(1000)
        cy.get(`.path-members`).click();
        cy.get(`.update-tier-erc20`).should('not.exist')
        cy.get(`.update-tier-erc1155`).should('not.exist')
    });
})