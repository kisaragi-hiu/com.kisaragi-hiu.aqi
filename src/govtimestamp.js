function govTimestampToISO8601(timestamp) {
  // We can expect the format to stay constant, I think.
  return (
    timestamp
      // "2021/04/13" -> "2021-04-13"
      .replace(/\//g, "-")
      // Use "T" as date/time separator
      .replace(" ", "T")
      // Explicit timezone
      .concat("+08:00")
  );
}

function govTimestampToFullDisplay(timestamp) {
  let [year, month, day, hours, minutes, _seconds] = timestamp.split(/ |\/|:/);
  return `${year}年${month}月${day}日 ${hours}時${minutes}分`;
}

function govTimestampToShortDisplay(timestamp) {
  let [_year, _month, _day, hours, minutes, _seconds] =
    timestamp.split(/ |\/|:/);
  return `${hours}:${minutes}`;
}

export {
  govTimestampToISO8601,
  govTimestampToFullDisplay,
  govTimestampToShortDisplay,
};
