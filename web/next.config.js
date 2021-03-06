const dev = process.env.NODE_ENV !== "production";

module.exports = {
  target: "serverless",
  env: {
    AUTH_PASSWORD: process.env.AUTH_PASSWORD,
    API_URL: dev ? "http://localhost:3000" : process.env.APP_URL,
    GA_ID: "UA-143166821-1",
  },
};
