let recipes = (state = [], action) => {
  let { type, payload } = action;

  switch (type) {
    case 'RECIPES_FETCH':
      return payload;
    case 'INFINITE_RECIPES_FETCH':
      payload.hits = [...state.hits, ...payload.hits];
      payload.count = state.count;
      return payload;
    default:
      return state;
  }
};

export default recipes;
