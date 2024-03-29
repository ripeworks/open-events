module.exports = {
  transpilePackages: [
    // these are mostly from antd
    "rc-pagination",
    "rc-calendar",
    "css-animation",
    "rc-tabs",
    "rc-util",
    "rc-time-picker",
    "rc-tooltip",
  ],
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Authorization, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
      {
        source: "/api/photo/(<id>[^/]*)",
        headers: [
          {
            key: "cache-control",
            value: "public,max-age=31536000,immutable",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
      {
        source: "/event/(<id>[^/]*)/edit",
        destination: "/edit?id=$id",
      },
    ];
  },
};
