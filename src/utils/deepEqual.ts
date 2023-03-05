export function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
      return true;
    }
  
    if (typeof obj1 !== typeof obj2 || obj1 == null || obj2 == null) {
      return false;
    }
  
    if (Array.isArray(obj1) !== Array.isArray(obj2)) {
      return false;
    }
  
    if (typeof obj1 === 'object') {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
  
      if (keys1.length !== keys2.length) {
        return false;
      }
  
      for (let key of keys1) {
        if (!obj2.hasOwnProperty(key) || !deepEqual(obj1[key], obj2[key])) {
          return false;
        }
      }
  
      return true;
    }
  
    return obj1 === obj2;
  }