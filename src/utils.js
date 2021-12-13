import moment from 'moment';

export const errorHandle = (name, err) => {
  if (err.data && err.data.message) {
    console.log(`${name} - ${err.data.message}`)
  } else {
    console.log(`${name} - ${err}`)
  }
}

export const tsToLocalStr = (ts) => {
  if (!ts) return ''
  return moment(Number(ts) * 1000).format()
}