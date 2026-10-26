// Shared by the Events page and My Profile

// An event is over once its end time (or its start time, if it has no end) has passed
export const isPastEvent = (event) => new Date(`${event.date}T${event.endTime || event.startTime}`) < new Date();

// Dates are YYYY-MM-DD and times are HH:MM, so comparing the strings sorts them by time
export const byDate = (a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`);
