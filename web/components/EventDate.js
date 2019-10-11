import RRule from "rrule";

const getRuleText = rrule => {
  const rule = RRule.fromString(rrule);

  return rule.toText();
};

export default ({
  start,
  end,
  allDay = false,
  block = false,
  recurrence = []
}) => {
  const [rrule] = recurrence;
  const isSameDay = start.isSame(end, "day");
  const time = allDay ? (
    isSameDay ? (
      "All day"
    ) : (
      ""
    )
  ) : (
    <span>
      {!block && " ⋅ "}
      {start.format("h:mm a")} - {end.format("h:mm a")}
    </span>
  );

  return (
    <div className="event-date">
      {isSameDay ? (
        <span>{start.format("dddd, MMMM D")}</span>
      ) : (
        <span>
          {start.format("MMMM D")} - {end.format("MMMM D, YYYY")}
        </span>
      )}
      {block ? <div>{time}</div> : time}
      {rrule ? <div>{getRuleText(rrule)}</div> : null}
    </div>
  );
};
