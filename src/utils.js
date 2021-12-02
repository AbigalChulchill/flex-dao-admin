export const errorHandle = (name, err) => {
  if (err.data && err.data.message) {
    window.alert(`${name} - ${err.data.message}`);
  } else {
    window.alert(`${name} - ${err}`);
  }
}