import { checkAndAdd } from '../lib/util.js';

let validateFavorite = favorite => {
  if (
    !favorite._id ||
    !favorite.image ||
    !favorite.label ||
    !favorite.calories ||
    !favorite.yield ||
    !favorite.url ||
    !favorite.uri ||
    !favorite.source ||
    !favorite.ingredientLines
  ) {
    throw new Error(
      'VALIDATION ERROR: favorite requires a id, image, label, calories, yield, url uri, source and ingredientlines.'
    );
  }
};

let favorites = (state = [], action) => {
  let { type, payload } = action;

  switch (type) {
    case 'FAVORITE_FETCH':
      validateFavorite(payload);
      return checkAndAdd(payload, state);
    case 'FAVORITES_FETCH':
      return payload;
    case 'FAVORITE_DELETE':
      if (state === []) {
        throw new Error('USAGE ERROR: can not delete favorite not in state');
      }
      return state.filter(favorite => favorite._id !== payload);
    case 'SIGN_OUT':
      return [];
    default:
      return state;
  }
};

export default favorites;
