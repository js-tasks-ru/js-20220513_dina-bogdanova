/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (obj) {
    let newObj = Object.entries(obj);
      for (let i = 0; i < newObj.length; i++) {
        let newValue =  newObj[i][0];
        newObj[i][0] = newObj[i][1];
        newObj[i][1] = newValue;
      }
    newObj = Object.fromEntries(newObj);
    return newObj;
  }
  else return;
}
