let log = (state = null, action) => {
  let { type, payload } = action;

  switch (type) {
    case 'LOGGED':
      return payload;
    default:
      return state;
  }
};

export default log;
