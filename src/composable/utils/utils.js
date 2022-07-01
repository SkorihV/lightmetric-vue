export function getDateTime(time) {
  const year = new Date().getFullYear()
  time = time.split(":");
  time = new Date(year,0,0,time[0],time[1],time[2]||0);
  return time;
}

export function isTime(value){
  if (!value) { return false; }
  return  value.toString().match('^[0-9]+:[0-5][0-9](:[0-5][0-9])?') !== null;
}

export function recognizeData(data){
  data = data.toString().replace(/ /g, "");
  if (isTime(data)) {
    return data;
  }
  if (evalValue(data)) {
    let value = evalValue(data);
    if (value.match('^[0-9]+(\.?[0-9])*$')) {
      return around(value);
    }
  }
  return '';
}

export function evalValue(value) {
  // if (isNaN(parseFloat(value))) { return false;}
  value = value?.toString().replace(/ /g, "") || false;
  try {
    return  eval(value);
  } catch (e) {
    console.error(e.message );
    return false;
  }
}

export function around(value) {
  if(isAround === '1' ) {
    value =   parseFloat(value).toFixed(2);
  } else if (isAround  === '0') {
    value =   parseInt(value).toFixed(0);
  }
  return value
}

/**
 * Обработка числа и разбиение на тысячи пробелами
 * @param value
 * @returns {string}
 */
export function separatorThousands (value) {
  let parts = value.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}

export function convertToString(value) {
  return value ? value.toString() : '';
}

export function getArrayParams(metric) {
  let params = [];
  if (!metric?.value || metric.value.formula === '' || metric.value.formula === undefined) { return false; }

  let paramsObj = null;
  if (metric.value.formula) {
    paramsObj = metric.value.formula.match(/((\+|\*|\-|\/|\(|\)){1})|\$[0-9]+\$|[0-9]+(\.{1}[0-9]+)?/g) || false;
  }
  if (!paramsObj) {
    return false;
  }

  for (let key in paramsObj) {
    params.push(paramsObj[key]);
  }
  return params;
}
