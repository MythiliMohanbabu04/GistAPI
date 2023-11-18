const { defineConfig } = require("cypress");
{
  reporter: "mochawesome";
  reporterOptions: {
    reportDir: "cypress/reports";
    overwrite: false;
    html: true;
    json: false;
  }
}
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://gist.github.com",
  },
  env: {
    CYPRESS_APP_HOST: "https://api.github.com",
    CYPRESS_BEARER_TOKEN: "Bearer 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",
    CYPRESS_INAVLID_BEARER_TOKEN: "Bearer invalidToken",
  },
});
