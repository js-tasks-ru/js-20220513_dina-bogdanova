/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  let set = new Set(arr);
  let newArr = [];
  set.forEach((value, valueAgain, set) => {
    newArr.push(value);
  });
  return newArr;
}