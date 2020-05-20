export function msToDuration(ms) {
  var minutes = Math.floor(ms / 60000);
  var seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export function toNumberFormat(number) {
  return new Intl.NumberFormat().format(number);
}
