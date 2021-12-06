export const countIndex = (index: number, page: number, take: number) => {
  const order = page > 1 ? (page - 1) * take + index : index;
  return order;
};

export function serialize(obj, prefix?) {
  const str = [];
  let p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? `${prefix}[${p}]` : p;

      const v = obj[p];
      str.push(
        v !== null && typeof v === 'object'
          ? serialize(v, k)
          : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`,
      );
    }
  }
  return str.join('&');
}


export const findInNestedArray = (list, property, val) => {
  let active = null;
  for (const item of list) {
    if (item[property] == val) {
      active = item;
    }
    if (item.children && item.children.length) {
      active = findInNestedArray(item.children, property, val);
    }
  }
  return active;
};

export const formatNumber = num => {
  if (num && Number(num)) {
    return num
      .toString()
      .replace('.', ',')
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }
  if (num && Number(num) === 0) {
    return 0;
  }

  return '';
};

export const deleteNullOrUndefinedInObject = obj => {
  Object.keys(obj).forEach(key => !obj[key] && delete obj[key]);
  if (Object.keys(obj).length > 0) return obj;
  return null;
};

export const getDescendantProp = (obj, desc) => {
  if (!desc) {
    return '';
  }
  const arr = desc.split('.');
  while (arr.length && (obj = obj[arr.shift()])) ;
  return obj || '';
};

export const groupBy = (array, key) => {
  return array.reduce((result, currentValue) => {
    (result[getDescendantProp(currentValue, key)] =
      result[getDescendantProp(currentValue, key)] || []).push(currentValue);
    return result;
  }, {});
};

export const debounce = (fn, delay) => {
  let timer = null;
  return function() {
    const context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
};
