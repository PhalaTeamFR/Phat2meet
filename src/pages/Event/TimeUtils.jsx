// Extract hours and minutes from a time string.
export function parseTime(timeStr) {
  const hours = parseInt(timeStr.substring(0, 2), 10);
  const minutes = parseInt(timeStr.substring(2), 10);
  return { hours, minutes };
}

// Create a Date object with the specified hours and minutes.
export function createTime(hours, minutes) {
  const time = new Date();
  time.setHours(hours);
  time.setMinutes(minutes);
  return time;
}

// Adds a leading zero to an hour or minute string if necessary.
export function padZero(timeComponent) {
  return timeComponent.toString().padStart(2, "0");
}

// Increments a Date object by adding a number of minutes.
export function incrementTimeByMinutes(time, minutes) {
  const newTime = new Date(time);
  newTime.setMinutes(newTime.getMinutes() + minutes);
  return newTime;
}

// Convert a Date object to a string formatted according to the specified locale.
export function toDateLocaleString(date, locale) {
  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "");
}

// Increments a Date object by adding a number of days.
export function incrementDateByDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}