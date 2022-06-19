import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

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

class RecipeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userSuccess: false,
      recipeError: false,
      userSuccessMessage: '',
      pageBottom: false,
    };
  }

  componentWillMount() {
    userValidation(this.props);
    let uri = window.location.href.split('/recipe/')[1];
    if (
      !this.props.recipe ||
      this.props.recipe.uri !=
        `http://www.edamam.com/ontologies/edamam.owl#recipe_${uri}`
    ) {
      this.props
        .recipeFetch(uri)
        .then(recipe => {
          if (!recipe) return this.setState({ recipeError: true });
          if (!this.props.recipes.length) {
            this.props
              .recipesFetch('search?q=summer', '&calories=0-10000', 0, false)
              .catch(err => logError(err));
          }
        })
        .catch(err => logError(err));
    } else if (
      !this.props.recipes ||
      !this.props.recipes.hits ||
      !this.props.recipes.hits.length
    ) {
      this.props
        .recipesFetch('search?q=summer', '&calories=0-10000', 0, false)
        .catch(err => logError(err));
    }
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    document.addEventListener('scroll', this.trackScrolling);
  }

  componentWillUnmount() {
    this.setState({
      userSuccess: false,
      recipeError: false,
      pageBottom: false,
    });
    document.removeEventListener('scroll', this.trackScrolling);
  }

  handleBoundFavoriteClick = () => {
    if (this.props.userAuth) {
      let found = this.props.favorites.filter(
        fav => fav.uri == this.props.recipe.uri
      );
      if (found.length) {
        this.props
          .favoriteDelete(found[0])
          .then(() => {
            this.setState({ userSuccessMessage: 'Favorite deleted.' });
            return this.handleUserSuccess();
          })
          .catch(err => logError(err));
      } else {
        return this.props
          .favoriteFetch(this.props.recipe)
          .then(() => {
            this.setState({ userSuccessMessage: 'Favorite added.' });
            return this.handleUserSuccess();
          })
          .catch(err => logError(err));
      }
    }
  };

  handleUserSuccess = () => {
    this.setState({ userSuccess: true });
    setTimeout(() => this.setState({ userSuccess: false }), 5000);
  };

  calsPS = (cals, servings) => Math.round(cals / servings);
  calsPD = (cals, servings) => (cals / servings / 20).toFixed(0);

  handleRedirect = url => {
    this.props.history.push(url);
    return window.scrollTo(0, 0);
  };

  trackScrolling = () => {
    const el = document.getElementById('recipePageWrapper');

    if (el.getBoundingClientRect().bottom <= window.innerHeight + 100) {
      if (!this.state.pageBottom) this.setState({ pageBottom: true });
    } else {
      if (this.state.pageBottom) this.setState({ pageBottom: false });
    }
  };

  render() {
    let { recipe } = this.props;
    const cal = require('./../helpers/assets/icons/cal.icon.svg');
    const serving = require('./../helpers/assets/icons/serving.icon.svg');
    let likedRecipe =
      this.props.favorites &&
      this.props.favorites.some(o => o['uri'] === recipe.uri);
    return (
      <div
        id="recipePageWrapper"
        className={classToggler({
          main: true,
          pageBottom: this.state.pageBottom,
        })}
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
                          <img className="irImg" src={recipe.image} />
                          <div
                            title={
                              likedRecipe
                                ? 'Remove this recipe from your favorites'
                                : 'Add this recipe from your favorites'
                            }
                            className={classToggler({
                              likeButton: true,
                              hideLike: !this.props.userAuth,
                              likedRecipe: likedRecipe,
                            })}
                            onClick={this.handleBoundFavoriteClick}
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
                        <img className="irImg" src={recipe.image} />
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
                            <img src={cal} className="iconScale" />
                          </span>
                        </span>
                        <span className="iconOuter servingIcon">
                          <span className="iconInner">
                            <span className="recipeIconsDiv">
                              {recipe.yield}{' '}
                              <span className="hideMobile">servings</span>
                            </span>
                            <img src={serving} className="iconScale" />
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
                      clozed: this.state.userSuccess,
                    })}
                    onClick={() => this.setState({ userSuccess: false })}
                  >
                    <p>{this.state.userSuccessMessage}</p>
                  </div>
                  <div className="aside">
                    <h2 className="irSectionHeader"> Recommended</h2>
                    {renderIf(
                      this.props.recipes.hits &&
                        this.props.recipes.hits.length > 0,
                      <RecipesMap
                        recipes={this.props.recipes.hits}
                        containerClass={'individualRecipeOuter'}
                        redirect={this.handleRedirect}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {this.state.recipeError && (
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
}

let mapStateToProps = state => ({
  recipe: state.recipe,
  recipes: state.recipes,
  userAuth: state.userAuth,
  favorites: state.favorites,
});

let mapDispatchToProps = dispatch => {
  return {
    favoriteFetch: favorite => dispatch(favoriteFetchRequest(favorite)),
    favoritesFetch: favoritesArr =>
      dispatch(favoritesFetchRequest(favoritesArr)),
    favoriteDelete: favorite => dispatch(favoriteDeleteRequest(favorite)),
    userProfileFetch: () => dispatch(userProfileFetchRequest()),
    tokenSignIn: token => dispatch(tokenSignInRequest(token)),
    recipeFetch: query => dispatch(recipeFetchRequest(query)),
    recipesFetch: (queryString, queryParams, min, infiniteSearch) =>
      dispatch(
        recipesFetchRequest(queryString, queryParams, min, infiniteSearch)
      ),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RecipeContainer)
);
