const withCss = require("@zeit/next-css");
const dev = process.env.NODE_ENV !== "production";

module.exports = withCss({
  target: "serverless",
  env: {
    AUTH_PASSWORD: process.env.AUTH_PASSWORD,
    API_URL: dev
      ? "http://localhost:3000"
      : "https://northportomenacalendar.com",
    GA_ID: "UA-143166821-1"
  }
});
