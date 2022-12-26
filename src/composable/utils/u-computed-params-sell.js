import {getDateTime, isTime} from './utils'


export function updateColor(value, normal, minimal) {
  let localMinimal        = null;
  let localNormal         = null;
  let localValueOutput    = null;


  if (isTime(minimal) && isTime(normal) && isTime(value)) {
    localMinimal = getDateTime(minimal);
    localNormal = getDateTime(normal);
    localValueOutput = getDateTime(value);
  }

  if ( minimal && normal &&  value.replace(/ /g, "") !== '' && localValueOutput instanceof Date) {
    if (localMinimal < localNormal) {
      if (localValueOutput < localMinimal) {
        return 'bad-cell';
      } else if (localValueOutput >= localMinimal && localValueOutput < localNormal) {
        return 'normal-cell';
      } else {
        return 'good-cell';
      }
    } else if (localMinimal >= localNormal) {
      if (localValueOutput <= localNormal) {
        return 'good-cell';
      } else if (localValueOutput > localNormal && localValueOutput <= localMinimal) {
        return 'normal-cell';
      } else {
        return 'bad-cell';
      }
    }
  } else if (!isNaN(parseFloat(minimal))  && !isNaN(parseFloat(normal)) && value.replace(/ /g, "") !== '' && !(localValueOutput instanceof Date) ) {
    localMinimal = Number(parseFloat(minimal).toFixed(2));
    localNormal = Number(parseFloat(normal).toFixed(2));
    localValueOutput = Number(parseFloat(value).toFixed(2));

    if (localMinimal < localNormal) {
      if (localValueOutput < localMinimal) {
        return 'bad-cell';
      } else if (localValueOutput >= localMinimal && localValueOutput < localNormal) {
        return 'normal-cell';
      } else {
        return 'good-cell';
      }
    } else if (localMinimal >= localNormal) {
      if (localValueOutput <= localNormal) {
        return 'good-cell';
      } else if (localValueOutput > localNormal && localValueOutput <= localMinimal) {
        return 'normal-cell';
      } else {
        return 'bad-cell';
      }
    }
  } else if(!localMinimal && !localNormal) {
    return '';
  }
}

