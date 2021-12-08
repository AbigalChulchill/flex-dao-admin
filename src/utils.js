import moment from 'moment';

export const errorHandle = (name, err) => {
  if (err.data && err.data.message) {
    window.alert(`${name} - ${err.data.message}`);
  } else {
    window.alert(`${name} - ${err}`);
  }
}

export const tsToLocalStr = (ts) => {
  if (!ts) return ''
  return moment(Number(ts) * 1000).format()
}