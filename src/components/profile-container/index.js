import React, { useEffect, useState, lazy } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Footer = lazy(() => import('../footer'));
import UserProfileForm from '../userProfile-form';
import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import {
  userProfileFetchRequest,
  userProfileUpdateRequest,
} from '../../actions/userProfile-actions.js';
import {
  favoritesFetchRequest,
  favoriteDeleteRequest,
} from '../../actions/favorite-actions.js';
import { recipeFetch } from '../../actions/search-actions.js';
import {
  userValidation,
  logError,
  formatDate,
  renderIf,
  classToggler,
} from './../../lib/util.js';
import profilePlaceholderImg from './../helpers/assets/icons/profilePlaceholder.webp';

function ProfileContainer(props) {
  let navigate = useNavigate();
  const [userSuccess, setUserSuccess] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [userSuccessMessage, setUserSuccessMessage] = useState('');

  useEffect(() => {
    userValidation(props, navigate, true);
    setUserSuccess(false);
    setEditProfile(false);
    setUserSuccessMessage('');
    window.scrollTo(0, 0);
  }, []);

  const handleProfileUpdate = profile => {
    return props
      .userProfileUpdate(profile)
      .then(() => {
        setEditProfile(false);
        setUserSuccessMessage('Profile updated.');
        return handleUserSuccess();
      })
      .catch(err => logError(err));
  };

  const handleBoundRecipeClick = async favorite => {
    try {
      props.recipeFetchRequest(favorite);
      let uri = favorite.uri.split('#recipe_')[1];
      await navigate(`/recipe/${uri}`);
    } catch (err) {
      logError(err);
    }
  };

  const handleboundDeleteFavoriteClick = favorite => {
    if (props.userAuth) {
      props
        .favoriteDelete(favorite)
        .then(() => {
          setUserSuccessMessage('Favorite deleted.');
          return handleUserSuccess();
        })
        .catch(err => logError(err));
    }
  };

  const handleUserSuccess = () => {
    setUserSuccess(true);
    setTimeout(() => setUserSuccess(false), 5000);
  };

  const calsPS = (cals, servings) => Math.round(cals / servings);

  let profileImage =
    props.userProfile && props.userProfile.image
      ? props.userProfile.image
      : profilePlaceholderImg;
  let { favorites, userProfile } = props;
  return (
    <div className="main">
      {userProfile && (
        <div className="profile-container page-outer-div">
          <div className="page-form">
            <div className="profileWrapper">
              <div className="inner-wrapper">
                <div className="profile-image-div">
                  <img
                    className="lazyload profile-image"
                    data-src={profileImage}
                    alt="User profile"
                  />
                  <p className="mainContainerHeader">{userProfile.username}</p>
                  <p className="profileDate">
                    Member Since: {formatDate(props.userProfile.createdOn)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="page-form">
            {renderIf(
              !props.userProfile.image,
              <div className="finishProfile">
                <p>Upload an image to complete your profile.</p>
              </div>
            )}
            {renderIf(
              editProfile,
              <UserProfileForm
                userProfile={props.userProfile}
                onComplete={handleProfileUpdate}
              />
            )}
            {renderIf(
              !editProfile,
              <div className="viewProfile">
                <p>
                  State: <span>{props.userProfile.state}</span>
                </p>
                <p>
                  Country: <span>{props.userProfile.country}</span>
                </p>
                <p>
                  Profile img URL: <span>{props.userProfile.image}</span>
                </p>
                <p
                  className="editProfileButton"
                  onClick={() => setEditProfile(true)}
                >
                  Edit
                </p>
              </div>
            )}
          </div>
          <div className="recipesOuter">
            <p className="favoritesHeader">Favorites</p>
            {renderIf(
              favorites && favorites.length > 0,
              <div className="recipesSection">
                {favorites.map((fav, idx) => {
                  let boundRecipeClick = handleBoundRecipeClick.bind(this, fav);
                  let boundDeleteFavoriteClick =
                    handleboundDeleteFavoriteClick.bind(this, fav);
                  return (
                    <div key={idx} className="outer">
                      <div
                        className="cardImageContainer"
                        onClick={boundRecipeClick}
                        title={fav.label}
                      >
                        <img
                          className="lazyload cardImage"
                          data-src={fav.image}
                          alt={fav.label}
                        />
                      </div>
                      <div
                        className="likeButton likedRecipe"
                        onClick={boundDeleteFavoriteClick}
                        title="Remove this recipe from your favorites"
                      ></div>
                      <div className="cardInfo" onClick={boundRecipeClick}>
                        <div className="byDiv">
                          <p className="byP">
                            <a
                              className="byA"
                              rel="noopener noreferrer"
                              target="_blank"
                              href={fav.url}
                              title={fav.source}
                            >
                              {fav.source}
                            </a>
                          </p>
                        </div>
                        <div className="cardInfoDiv" title={fav.label}>
                          <h3 className="cardTitle">{fav.label} </h3>
                          <p className="healthLabels">
                            {fav.healthLabels.join(', ')}{' '}
                          </p>
                          <p className="calsAndIngreds">
                            <span className="tileCalorieText">
                              {' '}
                              <span className="tileCalorieTextNumber">
                                {' '}
                                {calsPS(fav.calories, fav.yield)}
                              </span>{' '}
                              CALORIES{' '}
                            </span>{' '}
                            |{' '}
                            <span className="tileIngredientText">
                              {' '}
                              <span className="tileIngredientTextNumber">
                                {' '}
                                {fav.ingredientLines.length}{' '}
                              </span>{' '}
                              INGREDIENTS
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {renderIf(
              favorites && favorites.length < 1,
              <p className="noFavorites">No saved Favories.</p>
            )}
          </div>
          <div
            className={classToggler({
              sliderPopup: true,
              clozed: userSuccess,
            })}
            onClick={() => setUserSuccess(false)}
          >
            <p>{userSuccessMessage}</p>
          </div>
        </div>
      )}
      {!userProfile && (
        <div className="resultCountDiv">
          {' '}
          <p>Sorry, not logged in. Please try logging in.</p>
        </div>
      )}
      <Footer />
    </div>
  );
}

const mapStateToProps = state => ({
  userAuth: state.userAuth,
  userProfile: state.userProfile,
  favorites: state.favorites,
});

const mapDispatchToProps = dispatch => ({
  recipeFetchRequest: recipe => dispatch(recipeFetch(recipe)),
  favoriteDelete: favorite => dispatch(favoriteDeleteRequest(favorite)),
  favoritesFetch: favoritesArr => dispatch(favoritesFetchRequest(favoritesArr)),
  userProfileFetch: () => dispatch(userProfileFetchRequest()),
  tokenSignIn: token => dispatch(tokenSignInRequest(token)),
  userProfileUpdate: profile => dispatch(userProfileUpdateRequest(profile)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
