export const uploadTimer = (timeRemaining: number, uploadProgress: number) => {
  let timePrint =
    timeRemaining === -1
      ? 'Upload has not started'
      : timeRemaining !== -1 && uploadProgress < 1
      ? 'Upload started. Calculating...'
      : 'Time Remaining: ' + convertSecondsToHMS(timeRemaining);
  return timePrint;
};

const convertSecondsToHMS = (timeRemaining: number) => {
  //90000 (1.50 minutes) % 60000 => 30000 => 30 seconds
  const secondsPreFormat = ((timeRemaining % 60000) / 1000)
    .toFixed(0)
    .toString();
  //90000 / 60000 => 1.5 minutes => Math.floor = 1 minute
  //5,400,000 (1.5 hours) / 60000 => 90 % 60 => 30 minutes
  const minutesPreFormat =
    Math.floor(timeRemaining / 60000) < 60
      ? Math.floor(timeRemaining / 60000).toString()
      : (Math.floor(timeRemaining / 60000) % 60).toFixed(0).toString();
  //3,600,000 millis in one hour
  const hoursPreFormat = Math.floor(timeRemaining / 3600000).toString();

  const hours =
    hoursPreFormat.length < 2 ? '0' + hoursPreFormat : hoursPreFormat;
  const minutes =
    minutesPreFormat.length < 2 ? '0' + minutesPreFormat : minutesPreFormat;
  const seconds =
    secondsPreFormat.length < 2 ? '0' + secondsPreFormat : secondsPreFormat;

  const stringSMH = `${hours}:${minutes}:${seconds}`;

  return stringSMH;
};
