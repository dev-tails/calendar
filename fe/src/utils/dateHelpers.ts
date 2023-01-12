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
  const fullYear = date.getFullYear();
  const month = date.getMonth() + 1;
  const twoDigitsMonth = month[1] ? month : `0${month}`;
  const day = date.getDate();
  const twoDigitsDay = day.toString()[1] ? day : `0${day}`;

  const dateFormatting = {
    yyyy: fullYear,
    mm: twoDigitsMonth,
    dd: twoDigitsDay,
  };

  const dateFormat = format.split('-');
  const first = dateFormatting[dateFormat[0]];
  const second = dateFormatting[dateFormat[1]];
  const third = dateFormatting[dateFormat[2]];

  const dateString = `${first}${divider}${second}${divider}${third}`;
  return dateString;
};

// For value of element <input type='datetime-local'/> as 'yyyy-mm-ddThh:mm'
export const formatDateTimeInputValue = (date: Date) => {
  const dateString = formatSplitDate(new Date(), '-', 'yyyy-mm-dd');
  const hours = date.getHours();
  const twoDigitsHours = hours.toString()[1] ? hours : `0${hours}`;
  const minutes = date.getMinutes();
  const twoDigitsMinutes = minutes.toString()[1] ? minutes : `0${minutes}`;

  const dateTimeString = `${dateString}T${twoDigitsHours}:${twoDigitsMinutes}`;
  return dateTimeString;
};
