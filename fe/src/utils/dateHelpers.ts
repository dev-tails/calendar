export const timeOptions = {
  hour: 'numeric',
  minute: 'numeric',
};

export const dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export const dateTimeOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  timeZoneName: 'short',
};

export const formatDateTime = (
  locales: string,
  options: {},
  time: number | Date
) => {
  return new Intl.DateTimeFormat(locales, options).format(time);
};

export const formatSplitDate = (
  date: Date,
  divider: string,
  format: 'yyyy-mm-dd' | 'dd-mm-yyyy'
) => {
  // this will show proper date on edit event
  const fullYear = date.getFullYear();
  const month = date.getMonth() + 1;
  const twoDigitsMonth = String(month)[1] ? month : `0${month}`;
  const day = date.getDate();
  const twoDigitsDay = day.toString()[1] ? day : `0${day}`;

  const dateFormatting = {
    yyyy: fullYear,
    mm: twoDigitsMonth,
    dd: twoDigitsDay,
  };

  const dateFormat = format.split('-') as Array<keyof typeof dateFormatting>;
  const first = dateFormatting[dateFormat[0]];
  const second = dateFormatting[dateFormat[1]];
  const third = dateFormatting[dateFormat[2]];

  const dateString = `${first}${divider}${second}${divider}${third}`;
  console.log('date sti', dateString);
  return dateString;
};

// For value of element <input type='datetime-local'/> as 'yyyy-mm-ddThh:mm'
export const formatDateTimeInputValue = (date: Date) => {
  const dateString = formatSplitDate(date, '-', 'yyyy-mm-dd');
  const hours = date.getHours();
  const twoDigitsHours = hours.toString()[1] ? hours : `0${hours}`;
  const minutes = date.getMinutes();
  const twoDigitsMinutes = minutes.toString()[1] ? minutes : `0${minutes}`;

  const dateTimeString = `${dateString}T${twoDigitsHours}:${twoDigitsMinutes}`;
  console.log('dateTimeString', dateTimeString);
  return dateTimeString;
};

// For all day events - it will return midnight on current timezone
export const convertMidnightUTCToLocalDay = (date: Date) => {
  const utcMidnightDate = date.getUTCDate();
  const utcMidnightMonth = date.getUTCMonth();
  const utcMidnightFullYear = date.getUTCFullYear();

  const copiedDate = new Date(date.getTime());
  copiedDate.setDate(utcMidnightDate);
  copiedDate.setMonth(utcMidnightMonth);
  copiedDate.setFullYear(utcMidnightFullYear);
  return copiedDate;
};

/* 
Used for datetime input value
- It will return the date passed but with the current timezone time (the 
date remains as the passed one, will not change it to current time zone)
*/
export const addLocalTimeToDate = (date: Date) => {
  const currentTime = new Date();
  const currentTimeHrs = currentTime.getHours();
  const currentTimeMin = currentTime.getMinutes();
  const currentTimeSec = currentTime.getSeconds();
  const currentTimeMs = currentTime.getMilliseconds();

  const copiedDate = new Date(date.getTime());
  copiedDate.setHours(
    currentTimeHrs,
    currentTimeMin,
    currentTimeSec,
    currentTimeMs
  );
  return copiedDate;
};

export const addMinutesToDate = (date: Date, minutes: number) => {
  const addedMinutes = minutes * 60 * 1000;

  const copiedDate = new Date(date.getTime());
  const time = copiedDate.getTime();
  const newTimeNumber = copiedDate.setTime(time + addedMinutes);
  const dateWithAddedMin = new Date(newTimeNumber);
  return dateWithAddedMin;
};
