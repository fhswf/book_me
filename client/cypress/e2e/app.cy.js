/// <reference types="cypress" />

context('User not logged in', () => {
  describe('Error getting user', () => {
    beforeEach(() => {
      cy.intercept('/api/v1/users/user', {
        statusCode: 200, body: { "success": false, "message": "Unauthorized! Sign in again!" }
      }).as('getUser')
      cy.intercept('https://accounts.google.com/gsi/button', {
        statusCode: 200, body: {}
      }).as('googleButton')
    })

    it('Should redirect to landing', () => {
      cy.visit('/app')
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.location('pathname').should('eq', '/landing')
    })

    it('Should redirect to landing', () => {
      cy.intercept('/api/v1/users/user', {
        statusCode: 401, body: { "success": false, "message": "Unauthorized! Sign in again!" }
      }).as('getUser1')
      cy.visit('/app')
      cy.wait(['@getUser1'], { timeout: 10000 })
      cy.location('pathname').should('eq', '/landing')
    })

    it('Should redirect to landing', () => {
      cy.intercept('/api/v1/users/user', {
        statusCode: 500
      }).as('getUser2')
      cy.visit('/app')
      cy.wait(['@getUser2'], { timeout: 10000 })
      cy.location('pathname').should('eq', '/landing')
    })

    it('should show login button', () => {
      cy.visit('/app')
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.location('pathname').should('eq', '/landing')
      cy.get('[data-testid="profile-menu"]').click()
      cy.get('[data-testid="login-button"]').click()
      cy.get('iframe').should('exist')
    })
  })
})

context('Main page', () => {
  beforeEach(() => {
  })

  describe('Visit app main page & add event type', () => {
    beforeEach(() => {
      cy.intercept('/api/v1/users/user', { fixture: 'user' }).as('getUser')
      cy.intercept('GET', '/api/v1/events/event', { fixture: 'events' }).as('getEvents')
      cy.intercept('POST', '/api/v1/events/event', { fixture: 'addEvent' }).as('addEvent')
      cy.intercept('DELETE', '/api/v1/events/event/670eca0bc1eebcf903b17528', {
        statusCode: 200, body: { "msg": "Successfully deleted the Event" }
      }).as('deleteEvent')
    })

    it('Check add/delete event type', () => {
      cy.visit('/app')
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.wait(['@getEvents'], { timeout: 10000 })
      cy.intercept('GET', '/api/v1/events/event', { fixture: 'eventsAfter' }).as('getEventsAfter')
      cy.get('[data-testid="add-event-button"]').click()
      cy.get('[data-testid="event-form-title"]').type('Test event')
      cy.get('[data-testid="event-form-submit"]').click()

      cy.wait(['@addEvent'], { timeout: 10000 })
      cy.wait(['@getEventsAfter'], { timeout: 10000 })
      cy.get('[data-testid="copy-link-button"]').last().click({ force: true })

      cy.get('[data-testid="delete-event-button"]').last().click({ force: true })
      cy.wait(['@deleteEvent'], { timeout: 10000 })
      cy.get('[data-testid="event-card"]').should('have.length', 1)
      cy.get('[data-testid="event-card"]').contains('Test event').should('not.exist')
    })

    it('Check delete error handling', () => {
      cy.intercept('DELETE', '/api/v1/events/event/66e41e641f4f81ece1828ab5', {
        statusCode: 400, body: { "msg": "Successfully deleted the Event" }
      }).as('deleteEvent')
      cy.visit('/app')
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.wait(['@getEvents'], { timeout: 10000 })

      cy.get('[data-testid="delete-event-button"]').click()
      cy.wait(['@deleteEvent'], { timeout: 10000 })
    })
  })

  describe('Visit app main page & disable event', () => {
    before(() => {
      cy.intercept('/api/v1/users/user', { fixture: 'user' }).as('getUser')
      cy.intercept('/api/v1/events/event', { fixture: 'events' }).as('getEvents')
      cy.intercept('GET', '/api/v1/events/event/66e41e641f4f81ece1828ab5', { fixture: 'sprechstunde' }).as('getEvent')
      cy.intercept('PUT', '/api/v1/events/event/66e41e641f4f81ece1828ab5', { fixture: 'sprechstunde' }).as('putEvent')
    })

    it('Check event actions', () => {
      cy.visit('/app')
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.wait(['@getEvents'], { timeout: 10000 })
      cy.get('[data-testid="active-switch"]').click()
      cy.wait(['@putEvent'], { timeout: 10000 })
      cy.get('[data-testid="event-card"]').should('have.class', 'inactive')
      cy.get('[data-testid="active-switch"]').click()
      cy.wait(['@putEvent'], { timeout: 10000 })
      cy.get('[data-testid="event-card"]').should('have.class', 'active')
      cy.get('[data-testid="copy-link-button"]').click()
      cy.window().its('navigator.clipboard')
        .then((clip) => clip.readText())
        .should((s) => s.endsWith('users/christian-gawron/sprechstunde'))
    })
  })

  describe('Visit app main page & edit event type', () => {
    before(() => {
      cy.intercept('/api/v1/users/user', { fixture: 'user' }).as('getUser')
      cy.intercept('/api/v1/events/event', { fixture: 'events' }).as('getEvents')
      cy.intercept('/api/v1/events/event/66e41e641f4f81ece1828ab5', { fixture: 'sprechstunde' }).as('getEvent')
    })

    it('Check edit event type', () => {
      cy.visit('/app')
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.wait(['@getEvents'], { timeout: 10000 })
      cy.get('[data-testid="edit-event-button"]').click()
      cy.wait(['@getEvent'], { timeout: 10000 })
      cy.get('[data-testid="event-form-title"] input').should('have.value', 'Sprechstunde')
    })
  })

  describe('Visit app main page & log out', () => {
    before(() => {
      cy.intercept('/api/v1/users/user', { fixture: 'user' }).as('getUser')
      cy.intercept('/api/v1/events/event', { fixture: 'events' }).as('getEvents')
      cy.intercept('/api/v1/events/event/66e41e641f4f81ece1828ab5', { fixture: 'sprechstunde' }).as('getEvent')
    })

    it('Check log out', () => {
      cy.visit('/app')
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.wait(['@getEvents'], { timeout: 10000 })
      cy.get('[data-testid="profile-menu"]').click()
      cy.get('[data-testid="logout-button"]').click()
      cy.location('pathname').should('eq', '/landing')
    })
  })

  describe('Visit app main page & open calendar integration', () => {
    before(() => {
      cy.intercept('/api/v1/users/user', { fixture: 'user' }).as('getUser')
      cy.intercept('/api/v1/events/event', { fixture: 'events' }).as('getEvents')
      cy.intercept('/api/v1/google/calendarList', { fixture: 'calendarList' }).as('calendarList')
      cy.intercept('/api/v1/google/generateUrl', { fixture: 'generateUrl' }).as('generateUrl')
      cy.intercept('PUT', '/api/v1/users/user').as('putUser')
    })

    it('Open calendar integration', () => {
      cy.visit('/app')
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.wait(['@getEvents'], { timeout: 10000 })
      cy.get('[data-testid="profile-menu"]').click()
      cy.get('[data-testid="calendar-button"]').click()
      cy.location('pathname').should('eq', '/integration')
      cy.wait(['@calendarList'], { timeout: 10000 })
      cy.wait(['@generateUrl'], { timeout: 10000 })

      cy.get('[data-testid="edit-push-calendar"]').click()
      cy.get('[data-testid="calendar-select"]').children('input').parent().click()
        .get('ul > li[data-value="christian.gawron@gmail.com"]').click()
      cy.get('[data-testid="button-save"]').click()
      cy.wait(['@putUser'], { timeout: 10000 })
    })
  })

})
