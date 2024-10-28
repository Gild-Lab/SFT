describe('The Home Page', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    })
    beforeEach(() => {
        cy.visit('/#')
        cy.get(`#launch-button`).click();
    })
    it('renders $tokens', () => {
        // Load the component with the data
        cy.wait(1000)
        cy.get('.tokens').should('exist');
    });
    it('Should change view to list', () => {
        cy.get('.list-view-button').click();
        cy.get('.list-view').should('exist');

        cy.get('.tile-view-button').click();
        cy.get('.tile-view').should('exist');
    });
    it('Should not show token name if token not set', () => {
        cy.get('.sft-name-navigation-header').should('not.exist');
    });
    it('Should not show breadcrumbs on homepage', () => {
        cy.get('.breadcrumbs').should('not.exist');
    });
    it('Should set token and navigate to token overview', () => {
        cy.get(`#token-name-Sepolia-test`).click();
        cy.url().should('include', '/#token-overview')
        cy.get('#token-overview').should('exist');
        cy.get('.navigation-token-icon').should('exist');
    });
    it('Navigates to mint', () => {
        cy.get(`#token-name-Sepolia-test`).click();
        cy.wait(1000)
        cy.get(`.path-mint`).click();
        //There is no user logged in so it should go to ipfs login page
        cy.get('.ipfs-container').should('exist')
    });
    it('Navigates to asset-classes', () => {
        cy.get(`#token-name-Sepolia-test`).click();
        cy.wait(1000)
        cy.get(`.path-asset-classes`).click();
        cy.url().should('include', '/#asset-classes')
    });
    it('Navigates to members', () => {
        cy.get(`#token-name-Sepolia-test`).click();
        cy.wait(1000)
        cy.get(`.path-members`).click();
        cy.url().should('include', '/#members')
    });
    it('Navigates to roles', () => {
        cy.get(`#token-name-Sepolia-test`).click();
        cy.wait(1000)
        cy.get(`.path-roles`).click();
        cy.url().should('include', '/#roles')
    });
    it('Navigates to audit-history', () => {
        cy.get(`#token-name-Sepolia-test`).click();
        cy.wait(1000)
        cy.get(`.path-audit-history`).click();
        cy.url().should('include', '/#audit-history')
    });
    it('Navigates to asset-register', () => {
        cy.get(`#token-name-Sepolia-test`).click();
        cy.wait(1000)
        cy.get(`.path-asset-register`).click();
        cy.url().should('include', '/#asset-register')
    });
    it('Navigates to ipfs', () => {
        cy.get(`#token-name-Sepolia-test`).click();
        cy.wait(1000)
        cy.get(`.path-ipfs-login`).click();
        cy.url().should('include', '/#ipfs-login')
    });
    it('Navigates to setup', () => {
        cy.get(`.path-setup`).click();
        cy.url().should('include', '/#setup')
    });
    it('Navigates to home', () => {
        cy.get(`#token-name-Sepolia-test`).click();
        cy.wait(1000)
        cy.get(`.path-list`).click();
        cy.url().should('include', '/#list')
        cy.get('.tokens').should('exist');
    });
    it('Sets token image as logo', () => {
        cy.get(`#token-name-Sepolia-test`).click();
        cy.url().should('include', '/#token-overview')
        cy.get('#token-overview').should('exist');
        cy.get('.navigation-token-icon').should('exist');
        cy.get('.token-logo').should('exist');
        cy.get('.token-logo')
            .should('have.attr', 'src')
            .should('include', 'https://ipfs.io/ipfs/QmWEQvhDtQSMcSEAhvnDuX4hJacqiZkKUhDizM5MS2QFfW')
    });
    it('Should search and filter', () => {
        cy.get(`.search-bar`).should('exist');
        cy.get(`.token-Sepolia-test`).should('exist');
        cy.get(`.token-New-Project`).should('exist');
        cy.get('.search-input').type("Sepolia-test");
        cy.get(`.token-New-Project`).should('not.exist');
    });
    it('Should clear search and show all tokens', () => {
        cy.get(`.search-bar`).should('exist');
        cy.get(`.token-Sepolia-test`).should('exist');
        cy.get(`.token-New-Project`).should('exist');
        cy.get('.search-input').type("jefo");
        cy.get(`.token-New-Project`).should('not.exist');
        cy.get('.search-input').clear();
        cy.get(`.token-Sepolia-test`).should('exist');
        cy.get(`.token-New-Project`).should('exist');
    });
    it('Should search and filter by token address', () => {
        cy.get(`.search-bar`).should('exist');
        cy.get(`.token-Sepolia-test`).should('exist');
        cy.get(`.token-New-Project`).should('exist');
        cy.get('.search-input').type("0xdbcf2d8b73d06e6fa593b98857097257ebef1951");
        cy.get(`.token-New-Project`).should('not.exist');
    });
    it('Navigates to token overview', () => {
        cy.get(`#token-name-Sepolia-test`).click();
        cy.get(`.path-setup`).click();
        cy.get(`.sft-name`).click();
        cy.url().should('include', '/#token-overview')
        cy.get('#token-overview').should('exist');
        cy.get('.navigation-token-icon').should('exist');
    });
    it('Should check arbitrum is in the menu', () => {
        cy.get(`#networks-dropdown`).click();
        cy.get('#atbitrum').should('exist')
    });
    it('Should check arbitrum sepolia is in the menu', () => {
        cy.get(`#networks-dropdown`).click();
        cy.get('#sepolia').should('exist')
    });
})