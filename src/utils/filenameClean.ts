// const filename = '123-abc-xyz.mp4';

export const convertFileName = (filename: string) => {
  const arr = filename.split('-');
  arr.shift();
  return arr.join('-');
};
