const withCss = require("@zeit/next-css");
const dev = process.env.NODE_ENV !== "production";

module.exports = withCss({
  target: "serverless",
  env: {
    API_URL: dev
      ? "http://localhost:3000"
      : "https://northportomenacalendar.com"
  }
});
