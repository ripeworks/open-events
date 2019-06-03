const withCss = require("@zeit/next-css");

module.exports = withCss({
  target: "serverless",
  env: {
    API_URL: "https://northportomenacalendar.com"
  }
});
