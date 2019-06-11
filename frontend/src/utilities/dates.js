const monthNames = [
  { full: 'January', abb: 'Jan' },
  { full: 'February', abb: 'Feb' },
  { full: 'March', abb: 'Mar' },
  { full: 'April', abb: 'Apr' },
  { full: 'May', abb: 'May' },
  { full: 'June', abb: 'Jun' },
  { full: 'July', abb: 'Jul' },
  { full: 'August', abb: 'Aug' },
  { full: 'September', abb: 'Sep' },
  { full: 'October', abb: 'Oct' },
  { full: 'November', abb: 'Nov' },
  { full: 'December', abb: 'Dec' }
];

export const parseDate = date => {
  let datetime = new Date(date);
  let parsedDate = {};
  parsedDate.month = datetime.getMonth();
  parsedDate.fullMonthName = monthNames[parsedDate.month].full;
  parsedDate.abbMonthName = monthNames[parsedDate.month].abb;
  parsedDate.day = datetime.getDate();
  parsedDate.year = datetime.getFullYear();
  parsedDate.hour = datetime.getHours();
  parsedDate.ampm = 'AM';
  if (parsedDate.hour > 12) {
    parsedDate.hour -= 12;
    parsedDate.ampm = 'PM';
  }
  parsedDate.mins = datetime.getMinutes();
  parsedDate.secs = datetime.getSeconds();
  return parsedDate;
};

export const timeDisplay = time => {
  let seconds = Math.floor((time / 1000) % 60),
    minutes = Math.floor((time / (1000 * 60)) % 60),
    hours = Math.floor(time / (1000 * 60 * 60));

  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return hours + ':' + minutes + ':' + seconds;
};

export const getAbbMonthName = month => {
  return monthNames[month].abb;
};
