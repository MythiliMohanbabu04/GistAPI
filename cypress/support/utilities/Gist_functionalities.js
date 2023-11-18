const APP_HOST = Cypress.env("CYPRESS_APP_HOST");
const BEARER_TOKEN = Cypress.env("CYPRESS_BEARER_TOKEN");
const INVALID_TOKEN = Cypress.env("CYPRESS_INAVLID_BEARER_TOKEN");
let gistId;
let gistData;
let secretGistId;
let updatedContent;
class gistFunction {
  createNewGist() {
    gistData = {
      description: "New Gist",
      public: true,
      files: {
        "file1.txt": {
          content: "Content for file1.txt",
        },
      },
    };
    cy.request({
      method: "POST",
      url: `${APP_HOST}/gists`,
      body: gistData,
      headers: {
        Authorization: `${BEARER_TOKEN}`,
      },
    }).then((response) => {
      expect(response.status).to.equal(201);
      gistId = response.body.id;
      cy.visit(response.body.html_url);
      cy.contains(gistData.description).should("exist");
      cy.contains("file1.txt").should("exist");
      cy.contains(gistData.files["file1.txt"].content).should("exist");
    });
  }
  createSecretGist() {
    const secretGistData = {
      description: "New secret Gist",
      public: false,
      files: {
        "file1.txt": {
          content: "Content for secret gist",
        },
      },
    };
    cy.request({
      method: "POST",
      url: `${APP_HOST}/gists`,
      body: secretGistData,
      headers: {
        Authorization: `${BEARER_TOKEN}`,
      },
    }).then((response) => {
      expect(response.status).to.equal(201);
      secretGistId = response.body.id;
      cy.visit(response.body.html_url);
      cy.contains(secretGistData.description).should("exist");
      cy.contains("file1.txt").should("exist");
      cy.contains(secretGistData.files["file1.txt"].content).should("exist");
    });
  }
  editCreatedGist() {
    const updateGistData = {
      description: "New Gist",
      public: true,
      files: {
        "file1.txt": {
          content: "Updated Content for file1.txt",
        },
      },
    };
    cy.request({
      method: "PATCH",
      url: `${APP_HOST}/gists/${gistId}`,
      body: updateGistData,
      headers: {
        Authorization: `${BEARER_TOKEN}`,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      const contentValue = response.body.files["file1.txt"].content;
      cy.log(contentValue);
      cy.visit(response.body.html_url);
      cy.reload(true);
      cy.get("#file-file1-txt-LC1")
        .invoke("text")
        .then((text) => {
          cy.get('[data-hotkey="g r"]').click();
          cy.get('[data-hotkey="g c"]').click({ force: true });
          cy.log(contentValue);
          cy.get("#file-file1-txt-LC1").should("include.text", contentValue);
        });
    });
  }
  listCreatedGist() {
    cy.request({
      method: "GET",
      url: `${APP_HOST}/gists`,
      headers: {
        Authorization: `${BEARER_TOKEN}`,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      cy.visit(`/${gistId}`);
      cy.url().should("include", gistId);
    });
  }
  deleteCreatedGist() {
    cy.request({
      method: "DELETE",
      url: `${APP_HOST}/gists/${gistId}`,
      headers: {
        Authorization: `${BEARER_TOKEN}`,
      },
    }).then((response) => {
      expect(response.status).to.equal(204);
      cy.reload(true);
      cy.visit(`/${gistId}`, { failOnStatusCode: false });
      cy.wait(2000);
      // cy.get(
      //    '[alt="404 “This is not the web page you are looking for”"]'
      //  ).should("exist");
    });

    cy.request({
      method: "GET",
      url: `https://api.github.com/gists/${gistId}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(404);
      cy.log("Error message:", response.body.message);
    });
  }

  incorrectAuthentication() {
    cy.request({
      method: "POST",
      url: `${APP_HOST}/gists`,
      body: gistData,
      failOnStatusCode: false,
      headers: {
        Authorization: `${INVALID_TOKEN}`,
      },
    }).then((response) => {
      expect(response.status).to.equal(401);
      expect(response.body.message).to.contain("Bad credentials");
    });
  }
}
export default gistFunction;
