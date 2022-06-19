import { combineReducers } from 'redux';
import userAuth from './userAuth-reducers';
import userProfile from './userProfile-reducers';
import recipes from './recipes-reducers';
import recipe from './recipe-reducers';
import favorites from './favorites-reducers';
import homepage from './homepage-reducers';
import log from './log-reducers';

export default combineReducers({
  userAuth,
  userProfile,
  recipes,
  recipe,
  favorites,
  homepage,
  log,
});
