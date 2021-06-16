module.exports = JSON.parse(
  process.env.GOOGLE_CREDENTIALS_JSON.replace(/\n\s\s/g, "")
    .replace(/\n}/g, "}")
    .replace(/\n/g, "\\n")
);
