export const findMinIndex = (arr: number[]) => {
  let min = arr[0];
  let minIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
      minIndex = i;
    }
  }

  return minIndex;
};

export const getResizedImageUrl = (
  url: string,
  { width, height }: { width?: number; height?: number }
) => {
  let result = url + "?auto=compress&cs=tinysrgb";

  if (width) {
    result += `&w=${width}`;
  }

  if (height) {
    result += `&h=${height}}`;
  }

  return result;
};
