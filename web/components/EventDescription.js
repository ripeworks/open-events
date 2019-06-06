export default ({ description, summary = false }) => {
  return (
    <>
      {description
        .split("\n")
        .map(chunk => chunk.trim())
        .filter(Boolean)
        .map((chunk, i) => (
          <p key={i}>{chunk}</p>
        ))}
    </>
  );
};
