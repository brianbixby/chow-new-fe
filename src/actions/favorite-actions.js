import superagent from 'superagent';

export const favoriteFetch = favorite => ({
  type: 'FAVORITE_FETCH',
  payload: favorite,
});

export const favoritesFetch = favorites => ({
  type: 'FAVORITES_FETCH',
  payload: favorites,
});

export const favoriteDelete = favorite => ({
  type: 'FAVORITE_DELETE',
  payload: favorite,
});

export const favoriteFetchRequest = favorite => (dispatch, getState) => {
  let { userAuth } = getState();
  return superagent
    .post(`${process.env.REACT_APP_API_URL}/api/favorite`)
    .set('Authorization', `Bearer ${userAuth}`)
    .send(favorite)
    .then(res => {
      dispatch(favoriteFetch(res.body));
      return res;
    });
};

export const favoritesFetchRequest = favorites => (dispatch, getState) => {
  let { userAuth } = getState();
  return superagent
    .post(`${process.env.REACT_APP_API_URL}/api/favorites/user`)
    .set('Authorization', `Bearer ${userAuth}`)
    .send(favorites)
    .then(res => {
      dispatch(favoritesFetch(res.body));
      return res;
    });
};

export const favoriteDeleteRequest = favorite => (dispatch, getState) => {
  let { userAuth } = getState();
  return superagent
    .put(`${process.env.REACT_APP_API_URL}/api/favorite/${favorite._id}/remove`)
    .set('Authorization', `Bearer ${userAuth}`)
    .then(res => {
      dispatch(favoriteDelete(favorite._id));
      return res;
    });
};
