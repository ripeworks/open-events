const { google } = require("googleapis");
const { json } = require("micro");
const credentials = require("./credentials.json");

const calendarId = "m6vr4kp9epa15isbtbufi06cpk@group.calendar.google.com"; // Set to main calendar
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events"
];

const fixedEvents = [
  "efn32m24il4hj17munkknd4crs",
  "fcle3c5vpepbltt0rc8hn9ffro",
  "bm0bohg2dph604s5lt1fufiabo",
  "7l36nc0cmkpskdv4rng3vhu76o",
  "9ihm37epmnob67jhngho8cvul4",
  "0se3uo6b77nc1hgrgsi929sh4c",
  "6nb7ea44ru2lv3bm7pa8r3lqvk",
  "9lr3jccqskn0ul4sitgto16gis",
  "5k0op28ssnt0pa18r0h72g0vs8",
  "4d06e223spsp3ojm11is1culo8",
  "fjs5t5ochto7bes7v0kbc0msqs",
  "rjjo4ppc5mg3983sj6cbpvf4d0",
  "7hublbqd6hfetr9e8krk2lc920",
  "uiam48smhbens7tfk8e0uq6r1k",
  "9fq9ljpgfqnb4krd3jfh1j8fuo",
  "o95g9bq78lqeo8spdms6b8j2n0",
  "j76efg9rspjgq0l59iaa0s5sis",
  "k5ga5f1p094iuk0jl78ndshc4s",
  "h1ksb8ftgjsrcf62ra1mpbjis4",
  "flbgfkcbrg0jf0i9bv0ud80soc",
  "58kqa62rafljr77b8mm9nghp1o",
  "8k0hk6r36ipuvprc6j90qreleg",
  "slkhk1v8jb5joe4k4uaishgj8k",
  "p9jenhlpjd544sb8k2th6btbpo",
  "8e8l6hcofs4tobsj7gtg6e7gp4",
  "m82uibruuccnl4ros45iebn9ng",
  "dve1n74i92uo252rqighbjdcr0",
  "bddrnl461252fgmnf8io3st21o",
  "9kg93qjgh7v2u2g4nsc96lbjhs",
  "7ahkh0fkledet0l19csrjllrjg",
  "vgic7ts5pmhj86kqj9mfp46feo",
  "umvc5t6o738b04i291r94r5fp8",
  "rhdnkiiqeglcacavu0usmuff9c",
  "0hl937osere327m0hhg0hmfg0g",
  "99t4v3oi1o24judjctdhfv0apo",
  "1apjg74i1aiv7r2501h4g3b7ds",
  "hfa7i6nk9je1hru3c9dc49c1e4",
  "on71oeq71ehc16jja1dp7no1kk",
  "55map6h7ti91f77a9cviifqt38",
  "amhjnv6idgl7a5nvt3jn45rqsk",
  "5e1mvd5v8rvb7hbdnu0peqevig",
  "u3hcjl2p61586g8q9mmimlolhs",
  "e2r5kob7a9fgnv2sk50c72rgks",
  "vfrc6eh243l4m8kneb75olrmb0",
  "mr38857812rl669tjsabhjh6h8",
  "kjhl791ftskpfq2vhrjs14m61g",
  "n1p3qejo0ra9qb18fme0gugop4",
  "ctbhprp78ef55hon1lqn1q8r1o",
  "3qs3jcuobivgefatnt4p5eekck",
  "ioman8feddq79302l51mjnta3o",
  "hqka6ke1qbfp9839tkebpv5978",
  "58tk5dns6pk8ehgum6khm0furc",
  "0romb6spn7oducr2psbnm44bk8",
  "3mffd306sonkppeqe2rfr6t7b0",
  "gh2lnvprnda2n2ta4bk0gr9ab4",
  "6jo39vk9vbqa3v4d4tkolu0pf4",
  "2s5uldfv1l36ql0ll76h050mhk",
  "02kqlresciu2caoq4fv09ne9ns",
  "q5je708dg7l380nqosni4clpis",
  "vplnsu4gvtdccrov4sm696qids",
  "rs31ut7fgtnt44p15slrf2k25o",
  "cs730majueb8to81i1qot3eur4",
  "500c0joigjh89ch03pcvjkbak8",
  "ju8ppa41kjhfo218p0mgoci2fo",
  "h77t3vrdutnt2a00m06rcva9o4",
  "ds82aeh4pq0toijp35dmboo77s",
  "pujg3lovvcm6ju8d7849qss0ok",
  "umdnv28cb87998cgoaarpfvsdc",
  "s5itl6v9rmq0se3j2qa97foi04",
  "0e6a8j3jvhnl22nipv1rkfdca8",
  "4f2jv1bjl6vhciasv0nho8fmeg",
  "u33k2os8kgt5lnil9dadtg943s",
  "vevgepncejcepni6io98dag2c4",
  "ui33cgf96k3dihn1okhugd6184",
  "lceoedgpqsul39pqu09nkt8858",
  "1nflbav3vphjknvkku973bpruo",
  "crnrpmin8f7am5hdkje2hffe4c",
  "q57454asp1fbgh9jrhds6enj9o",
  "h6s1a7ndoco9bnd425pa0rr3g8",
  "2pte3uc6p6qd3ckvap6l6spodg"
];

const volunteerText = ({ needsVolunteers, volunteerContact }) => {
  if (!needsVolunteers) return "";

  return `Interested in being a volunteer? Contact ${volunteerContact}.`;
};

const getDateTime = ({ date, time, allDay = false }) => {
  const dateTime = new Date(date);

  if (allDay) {
    const [day] = dateTime.toISOString().split("T");
    return day;
  }

  // for some reason we add 4 here (timezone?)
  dateTime.setHours(Math.floor(time) + 4, time % 1 === 0 ? 0 : 30);
  return dateTime.toISOString();
};

const main = async () => {
  const auth = await google.auth.getClient({
    credentials,
    scopes: SCOPES
  });
  const cal = google.calendar({ version: "v3", auth });
  const events = await cal.events.list({
    calendarId
  });

  await Promise.all(
    events.data.items.map(async event => {
      console.log(event.id);
      const {
        start: { dateTime: startDateTime, date: allDayStart },
        end: { dateTime: endDateTime, date: allDayEnd }
      } = event;

      if (fixedEvents.includes(event.id)) {
        return;
      }

      if (allDayStart) {
        return;
      }

      const start = new Date(startDateTime);
      const end = new Date(endDateTime);

      start.setHours(start.getHours() + 4);
      end.setHours(end.getHours() + 4);

      await cal.events.patch({
        calendarId,
        eventId: event.id,
        resource: {
          start: {
            dateTime: start.toISOString(),
            timeZone: "America/Detroit"
          },
          end: {
            dateTime: end.toISOString(),
            timeZone: "America/Detroit"
          }
        }
      });
    })
  );
};

main();
