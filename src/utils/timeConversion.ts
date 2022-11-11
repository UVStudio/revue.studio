export const monthConverter = (month: number) => {
  switch (month) {
    case 1:
      return 'Jan';
    case 2:
      return 'Feb';
    case 3:
      return 'Mar';
    case 4:
      return 'Apr';
    case 5:
      return 'May';
    case 6:
      return 'Jun';
    case 7:
      return 'Jul';
    case 8:
      return 'Aug';
    case 9:
      return 'Sep';
    case 10:
      return 'Oct';
    case 11:
      return 'Nov';
    case 12:
      return 'Dec';
    default:
      return 'Unknown';
  }
};

export const timeStampConverter = (timeStamp: number) => {
  const dateObj = new Date(timeStamp);

  const dateInfo = {
    year: dateObj.getFullYear(),
    month: monthConverter(dateObj.getMonth() + 1),
    day: dateObj.getDate(),
    hour: dateObj.getHours(),
    minute: dateObj.getMinutes(),
  };

  const minString =
    dateInfo.minute.toString().length < 2
      ? '0' + dateInfo.minute.toString()
      : dateInfo.minute.toString();

  const dateString =
    dateInfo.month +
    ' ' +
    dateInfo.day +
    ' ' +
    dateInfo.year +
    ' - ' +
    dateInfo.hour +
    ':' +
    minString;
  return dateString;
};
