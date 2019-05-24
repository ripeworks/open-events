export default ({ start, end, allDay = false }) => {
  const isSameDay = start.isSame(end, "day");

  return (
    <div>
      {isSameDay ? (
        <span>{start.format("dddd, MMMM D")}</span>
      ) : (
        <span>
          {start.format("MMMM D")} - {end.format("MMMM D, YYYY")}
        </span>
      )}
      {allDay ? (
        isSameDay ? (
          "All day"
        ) : (
          ""
        )
      ) : (
        <span>
          {" "}
          ⋅ {start.format("h:mm a")} - {end.format("h:mm a")}
        </span>
      )}
    </div>
  );
};
