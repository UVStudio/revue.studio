export const convertTime = (millisecond: string) => {
  const numberMilli = Number(millisecond);
  const date = new Date(numberMilli)
    .toString()
    .split(' ')
    .splice(1, 4)
    .join(' ');
  return date;
};
