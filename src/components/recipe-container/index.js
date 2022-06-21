import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Footer from '../footer';
import RecipesMap from '../recipes-map';
import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import {
  favoritesFetchRequest,
  favoriteFetchRequest,
  favoriteDeleteRequest,
} from '../../actions/favorite-actions.js';
import {
  recipeFetchRequest,
  recipesFetchRequest,
} from '../../actions/search-actions.js';
import {
  logError,
  renderIf,
  classToggler,
  userValidation,
} from './../../lib/util.js';
import cal from './../helpers/assets/icons/cal.icon.svg';
import serving from './../helpers/assets/icons/serving.icon.svg';

function RecipeContainer(props) {
  let navigate = useNavigate();
  let recipePageWrapperRef = React.createRef();
  const [userSuccess, setUserSuccess] = useState(false);
  const [recipeError, setRecipeError] = useState(false);
  const [userSuccessMessage, setUserSuccessMessage] = useState('');
  const [pageBottom, setPageBottom] = useState(false);

  useEffect(() => {
    userValidation(props, navigate);
    let uri = window.location.href.split('/recipe/')[1];
    if (
      !props.recipe ||
      props.recipe.uri !=
        `http://www.edamam.com/ontologies/edamam.owl#recipe_${uri}`
    ) {
      props
        .recipeFetch(uri)
        .then(recipe => {
          if (!recipe) {
            return setRecipeError(true);
          }
          if (!props.recipes.length) {
            props
              .recipesFetch('search?q=summer', '&calories=0-10000', 0, false)
              .catch(err => logError(err));
          }
        })
        .catch(err => logError(err));
    } else if (
      !props.recipes ||
      !props.recipes.hits ||
      !props.recipes.hits.length
    ) {
      props
        .recipesFetch('search?q=summer', '&calories=0-10000', 0, false)
        .catch(err => logError(err));
    }
    window.scrollTo(0, 0);
    document.addEventListener('scroll', trackScrolling);
    return function cleanup() {
      setUserSuccess(false);
      setRecipeError(false);
      setPageBottom(false);
      document.removeEventListener('scroll', trackScrolling);
    };
  }, []);

  const handleBoundFavoriteClick = () => {
    if (props.userAuth) {
      let found = props.favorites.filter(fav => fav.uri == props.recipe.uri);
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
          .favoriteFetch(props.recipe)
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

  //   const calsPS = (cals, servings) => Math.round(cals / servings);
  //   const calsPD = (cals, servings) => (cals / servings / 20).toFixed(0);

  const handleRedirect = url => {
    navigate(url);
    return window.scrollTo(0, 0);
  };

  const trackScrolling = () => {
    const el = document.getElementById('recipePageWrapper');

    if (el.getBoundingClientRect().bottom <= window.innerHeight + 100) {
      if (!pageBottom) {
        setPageBottom(true);
      }
    } else {
      if (pageBottom) {
        setPageBottom(false);
      }
    }
  };

  let { recipe } = props;

  let likedRecipe =
    props.favorites && props.favorites.some(o => o['uri'] === recipe.uri);
  return (
    <div
      id="recipePageWrapper"
      className={classToggler({
        main: true,
        pageBottom: pageBottom,
      })}
      ref={recipePageWrapperRef}
    >
      <div>
        {recipe && (
          <div className="container">
            {renderIf(
              !recipe || (recipe && recipe.length < 1),
              <div>Sorry, no results.</div>
            )}
            {renderIf(
              recipe &&
                recipe.uri &&
                recipe.uri.length > 0 &&
                recipe.digest.length > 0,
              <div className="irContainer">
                <div className="irMain">
                  <div className="irHead">
                    <div className="irImgContainerDisplaySmall">
                      <div className="irImgContainerInnerWrapper">
                        <img
                          className="irImg"
                          src={recipe.image}
                          alt={recipe.label}
                        />
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
                          onClick={handleBoundFavoriteClick}
                        ></div>
                      </div>
                    </div>
                    <div className="irMainInfo">
                      <p className="irLabel">{recipe.label}</p>
                      <div className="irhealthLabels">
                        <div className="irhealthLabelsInner">
                          {recipe.healthLabels.map((label, idx) => {
                            let span =
                              idx == recipe.healthLabels.length - 1 ? (
                                <span></span>
                              ) : (
                                <span>|</span>
                              );
                            return (
                              <p key={idx} className="">
                                {label}
                                {span}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="irImgContainerDisplayLarge">
                      <img
                        className="irImg"
                        src={recipe.image}
                        alt={recipe.label}
                      />
                    </div>
                  </div>
                  <div className="recipeColumn">
                    <div className="irIngredients">
                      <h2 className="irIngredientHead irSectionHeader">
                        {' '}
                        {recipe.ingredientLines.length} Ingredients
                      </h2>
                      {recipe.ingredientLines.map((ingredient, idx) => {
                        return (
                          <div key={idx} className="">
                            <p>{ingredient}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="irDirections hideSmall">
                      <h2 className="irDirectionsHead irSectionHeader">
                        {' '}
                        Directions
                      </h2>
                      <p>
                        <a
                          className="button"
                          rel="noopener noreferrer"
                          target="_blank"
                          href={recipe.url}
                        >
                          Directions
                        </a>{' '}
                        <span className="gray">on</span>{' '}
                        <a
                          className="link"
                          rel="noopener noreferrer"
                          target="_blank"
                          href={recipe.url}
                        >
                          {recipe.source}
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="irNutrition">
                    <h2 className="irNutritionHead irSectionHeader">
                      Nutrition
                      <span className="iconOuter">
                        <span className="iconInner">
                          <span className="recipeIconsDiv">
                            {parseInt(recipe.calories / recipe.yield)}{' '}
                            <span className="hideMobile">cals</span>
                          </span>
                          <img
                            src={cal}
                            className="iconScale"
                            alt="calories icon"
                          />
                        </span>
                      </span>
                      <span className="iconOuter servingIcon">
                        <span className="iconInner">
                          <span className="recipeIconsDiv">
                            {recipe.yield}{' '}
                            <span className="hideMobile">servings</span>
                          </span>
                          <img
                            src={serving}
                            className="iconScale"
                            alt="serving icon"
                          />
                        </span>
                      </span>
                    </h2>
                    <div className="totalNutrientColumn">
                      {recipe.digest.map((digest, idx) => {
                        let total = parseInt(digest.total / recipe.yield);
                        let percent = parseInt(digest.daily / recipe.yield);
                        percent = percent > 0 ? `${percent}%` : '-';
                        return (
                          <div key={idx} className="nutrientRow">
                            <p>
                              <span className="nutrientColumnLabel">
                                {digest.label}
                              </span>
                              <span className="nutrientColumnPercent">
                                {percent}
                              </span>
                              <span className="nutrientColumnTotal">
                                {total}
                                {digest.unit}
                              </span>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="irDirections hideBig">
                    <h2 className="irDirectionsHead irSectionHeader">
                      {' '}
                      Directions
                    </h2>
                    <p>
                      <a
                        className="button"
                        rel="noopener noreferrer"
                        target="_blank"
                        href={recipe.url}
                      >
                        Directions
                      </a>{' '}
                      <span className="gray">on</span>{' '}
                      <a
                        className="link"
                        rel="noopener noreferrer"
                        target="_blank"
                        href={recipe.url}
                      >
                        {recipe.source}
                      </a>
                    </p>
                  </div>
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
                <div className="aside">
                  <h2 className="irSectionHeader"> Recommended</h2>
                  {renderIf(
                    props.recipes.hits && props.recipes.hits.length > 0,
                    <RecipesMap
                      recipes={props.recipes.hits}
                      containerClass={'individualRecipeOuter'}
                      redirect={handleRedirect}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {recipeError && (
          <div className="resultCountDiv">
            {' '}
            <p>Sorry, no results. Please try modifying your search.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = state => ({
  recipe: state.recipe,
  recipes: state.recipes,
  userAuth: state.userAuth,
  favorites: state.favorites,
});

const mapDispatchToProps = dispatch => ({
  favoriteFetch: favorite => dispatch(favoriteFetchRequest(favorite)),
  favoritesFetch: favoritesArr => dispatch(favoritesFetchRequest(favoritesArr)),
  favoriteDelete: favorite => dispatch(favoriteDeleteRequest(favorite)),
  userProfileFetch: () => dispatch(userProfileFetchRequest()),
  tokenSignIn: token => dispatch(tokenSignInRequest(token)),
  recipeFetch: query => dispatch(recipeFetchRequest(query)),
  recipesFetch: (queryString, queryParams, min, infiniteSearch) =>
    dispatch(
      recipesFetchRequest(queryString, queryParams, min, infiniteSearch)
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipeContainer);
