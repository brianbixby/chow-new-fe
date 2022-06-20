import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Footer from '../footer';
import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import {
  favoritesFetchRequest,
  favoriteFetchRequest,
  favoriteDeleteRequest,
} from '../../actions/favorite-actions.js';
import {
  recipesFetchRequest,
  recipesFetch,
  recipeFetch,
  infiniteRecipesFetch,
} from '../../actions/search-actions.js';
import {
  logError,
  renderIf,
  userValidation,
  classToggler,
} from './../../lib/util.js';

function RecipesContainer(props) {
  let navigate = useNavigate();
  const [userSuccess, setUserSuccess] = useState(false);
  const [userSuccessMessage, setUserSuccessMessage] = useState('');

  useEffect(() => {
    userValidation(props, navigate);
    if (!props.recipes || !props.recipes.hits || !props.recipes.hits.length) {
      let string = window.location.href.split('/search/')[1];
      let hashIndex = string.indexOf('&');
      let queryString = string.substring(0, hashIndex);
      let queryParams = string.substring(hashIndex, string.length);
      if (
        localStorage.getItem(`${queryString}${queryParams}0`) &&
        JSON.parse(localStorage.getItem(`${queryString}${queryParams}0`))[
          'timestamp'
        ] > new Date().getTime()
      ) {
        props.recipesFetchRequest(
          JSON.parse(localStorage.getItem(`${queryString}${queryParams}0`))[
            'content'
          ]
        );
      } else {
        props
          .recipesFetch(queryString, queryParams, 0, false)
          .catch(err => logError(err));
      }
    }
    window.scrollTo(0, 0);
    document.addEventListener('scroll', trackScrolling);
  }, []);

  //   componentWillUnmount() {
  //     setState({ userSuccess: false });
  //     document.removeEventListener('scroll', trackScrolling);
  //   }

  const handleBoundRecipeClick = myRecipe => {
    props.recipeFetchRequest(myRecipe.recipe);
    let uri = myRecipe.recipe.uri.split('recipe_')[1];
    return navigate(`/recipe/${uri}`);
  };

  const handleBoundFavoriteClick = favorite => {
    if (props.userAuth) {
      let found = props.favorites.filter(fav => fav.uri == favorite.recipe.uri);
      if (found.length) {
        props
          .favoriteDelete(found[0])
          .then(() => {
            setUserSuccessMessage('Favorite deleted.');
            return handleUserSuccess();
          })
          .catch(err => logError(err));
      } else {
        return props
          .favoriteFetch(favorite.recipe)
          .then(() => {
            setUserSuccessMessage('Favorite added.');
            return handleUserSuccess();
          })
          .catch(err => logError(err));
      }
    }
  };

  const handleUserSuccess = () => {
    setUserSuccess(true);
    setTimeout(() => setUserSuccess(false), 5000);
  };

  const calsPS = (cals, servings) => Math.round(cals / servings);

  const isBottom = el =>
    el.getBoundingClientRect().bottom <= window.innerHeight + 1500;

  const trackScrolling = () => {
    document.removeEventListener('scroll', trackScrolling);
    const wrappedElement = document.getElementById('recipesWrapper');
    if (
      isBottom(wrappedElement) &&
      props.recipes &&
      props.recipes.hits &&
      props.recipes.hits.length < 96
    ) {
      let string = window.location.href.split('/search/')[1];
      let hashIndex = string.indexOf('&');
      let queryString = string.substring(0, hashIndex);
      let queryParams = string.substring(hashIndex, string.length);
      let min = props.recipes.hits.length.toString();
      if (
        localStorage.getItem(`${queryString}${queryParams}${min}`) &&
        JSON.parse(localStorage.getItem(`${queryString}${queryParams}${min}`))[
          'timestamp'
        ] > new Date().getTime()
      ) {
        props.infiniteRecipesFetchRequest(
          JSON.parse(
            localStorage.getItem(`${queryString}${queryParams}${min}`)
          )['content']
        );
        return document.addEventListener('scroll', trackScrolling);
      } else {
        const infiniteSearch = true;
        return props
          .recipesFetch(queryString, queryParams, min, infiniteSearch)
          .then(() => document.addEventListener('scroll', trackScrolling))
          .catch(err => logError(err));
      }
    }
    document.addEventListener('scroll', trackScrolling);
  };

  let { recipes } = props;
  return (
    <div className="main">
      <div id="recipesWrapper" className="container-fluid">
        {renderIf(
          !recipes,
          <div className="resultCountDiv">
            Sorry, no results. Please try modifying your search.
          </div>
        )}
        <div className="recipesOuter">
          {renderIf(
            recipes,
            <div>
              <div className="resultCountDiv">
                <p>
                  {recipes.count} recipe results for <span>"{recipes.q}"</span>
                </p>
              </div>
              {props.recipes.hits && (
                <div className="recipesSection">
                  {props.recipes.hits.map((myRecipe, idx) => {
                    let boundRecipeClick = handleBoundRecipeClick.bind(
                      this,
                      myRecipe
                    );
                    let boundFavoriteClick = handleBoundFavoriteClick.bind(
                      this,
                      myRecipe
                    );
                    let likedRecipe =
                      props.favorites &&
                      props.favorites.some(
                        o => o['uri'] === myRecipe.recipe.uri
                      );
                    return (
                      <div key={idx} className="outer">
                        <div
                          className="cardImageContainer"
                          onClick={boundRecipeClick}
                          title={myRecipe.recipe.label}
                        >
                          <img
                            className="cardImage"
                            src={myRecipe.recipe.image}
                            alt={myRecipe.recipe.label}
                          />
                        </div>
                        <div
                          title={
                            likedRecipe
                              ? 'Remove this recipe from your favorites'
                              : 'Add this recipe from your favorites'
                          }
                          className={classToggler({
                            likeButton: true,
                            hideLike: !props.userAuth,
                            likedRecipe: likedRecipe,
                          })}
                          onClick={boundFavoriteClick}
                        ></div>
                        <div className="cardInfo" onClick={boundRecipeClick}>
                          <div className="byDiv">
                            <p className="byP">
                              <a
                                className="byA"
                                rel="noopener noreferrer"
                                target="_blank"
                                href={myRecipe.recipe.url}
                                title={myRecipe.recipe.source}
                              >
                                {myRecipe.recipe.source}
                              </a>
                            </p>
                          </div>
                          <div
                            className="cardInfoDiv"
                            title={myRecipe.recipe.label}
                          >
                            <h3 className="cardTitle">
                              {myRecipe.recipe.label}{' '}
                            </h3>
                            <p className="healthLabels">
                              {myRecipe.recipe.healthLabels.join(', ')}{' '}
                            </p>
                            <p className="calsAndIngreds">
                              <span className="tileCalorieText">
                                {' '}
                                <span className="tileCalorieTextNumber">
                                  {' '}
                                  {calsPS(
                                    myRecipe.recipe.calories,
                                    myRecipe.recipe.yield
                                  )}
                                </span>{' '}
                                <span className="caloriesSpan">CALORIES </span>
                                <span className="calsSpan">CALS </span>{' '}
                              </span>{' '}
                              |{' '}
                              <span className="tileIngredientText">
                                {' '}
                                <span className="tileIngredientTextNumber">
                                  {' '}
                                  {myRecipe.recipe.ingredientLines.length}{' '}
                                </span>
                                <span className="ingredientsSpan">
                                  {' '}
                                  INGREDIENTS
                                </span>
                                <span className="ingredsSpan"> INGRDS</span>
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div>
                {renderIf(
                  props.recipes &&
                    props.recipes.hits &&
                    props.recipes.hits.length >= 96,
                  <div className="infiniteScrollMax">
                    <p>Sorry, but the API limits our query results. </p>
                  </div>
                )}
              </div>
            </div>
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
      <Footer />
    </div>
  );
}

const mapStateToProps = state => ({
  recipes: state.recipes,
  userAuth: state.userAuth,
  favorites: state.favorites,
});

const mapDispatchToProps = dispatch => ({
  favoritesFetch: favoritesArr => dispatch(favoritesFetchRequest(favoritesArr)),
  favoriteFetch: favorite => dispatch(favoriteFetchRequest(favorite)),
  favoriteDelete: favorite => dispatch(favoriteDeleteRequest(favorite)),
  userProfileFetch: () => dispatch(userProfileFetchRequest()),
  tokenSignIn: token => dispatch(tokenSignInRequest(token)),
  recipesFetch: (queryString, queryParams, min, infiniteSearch) =>
    dispatch(
      recipesFetchRequest(queryString, queryParams, min, infiniteSearch)
    ),
  recipesFetchRequest: recipes => dispatch(recipesFetch(recipes)),
  recipeFetchRequest: recipe => dispatch(recipeFetch(recipe)),
  infiniteRecipesFetchRequest: recipes =>
    dispatch(infiniteRecipesFetch(recipes)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipesContainer);
