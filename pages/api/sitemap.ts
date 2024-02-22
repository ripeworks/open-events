import { NextApiRequest, NextApiResponse } from "next";
import builder from "xmlbuilder";

const getUrl = (path = "/") => {
  return `https://www.northportomenacalendar.com${path}`;
};

const getSitemap = async () => {
  const map = {
    urlset: {
      "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
      "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "@xsi:schemaLocation":
        "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
      url: [{ loc: getUrl() }],
    },
  };

  const eventsRes = await fetch(getUrl("/api/list"));
  const events = await eventsRes.json();

  events.items.map((event) => {
    map.urlset.url.push({ loc: getUrl(`/event/${event.id}`) });
  });

  const sitemap = builder.create(map, { encoding: "utf-8" });
  return sitemap.end({ pretty: true });
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const sitemap = await getSitemap();
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(sitemap);
}
