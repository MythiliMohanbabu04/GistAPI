import GistFunctions from "../support/utilities/Gist_functionalities";
const gistFunctions = new GistFunctions();

describe("Gist API and Frontend Test", () => {
  it("Create new Public gist via API and validate on Frontend", () => {
    gistFunctions.createNewGist();
  });

  it("Create new Secret gist via API and validate on Frontend", () => {
    gistFunctions.createSecretGist();
  });

  it("Edit an existing Gist and verify changes", () => {
    gistFunctions.editCreatedGist();
  });

  it("List Gists and verify the created Gist is available", () => {
    gistFunctions.listCreatedGist();
  });
  it("Delete an existing Gist and verify deletion", () => {
    gistFunctions.deleteCreatedGist();
  });

  it("Handle incorrect authentication", () => {
    gistFunctions.incorrectAuthentication();
  });
});
