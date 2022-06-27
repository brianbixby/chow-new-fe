import React from 'react';
import { connect } from 'react-redux';

import { recipeFetch } from '../../actions/search-actions.js';
import {
  favoriteFetchRequest,
  favoriteDeleteRequest,
} from '../../actions/favorite-actions.js';
import { renderIf, logError, classToggler } from '../../lib/util';

class RecipesMap extends React.Component {
  constructor(props) {
    super(props);
    this.asideRef = React.createRef();
    this.state = { userSuccess: false, userSuccessMessage: '' };
  }

  handleBoundRecipeClick = myRecipe => {
    this.props.recipeFetchRequest(myRecipe.recipe);
    let uri = myRecipe.recipe.uri.split('recipe_')[1];
    return this.props.redirect(`/recipe/${uri}`);
  };

  handleBoundFavoriteClick = favorite => {
    if (this.props.userAuth) {
      let found = this.props.favorites.filter(
        fav => fav.uri == favorite.recipe.uri
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
          .favoriteFetch(favorite.recipe)
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

  handleUpClick = () => {
    this.asideRef
      ? this.asideRef.current.scrollBy(0, -1 * (window.innerHeight - 132))
      : null;
  };

  handleDownClick = () => {
    this.asideRef
      ? this.asideRef.current.scrollBy(0, window.innerHeight - 132)
      : null;
  };

  render() {
    let { recipes } = this.props;
    return (
      <div className={this.props.containerClass} ref={this.asideRef}>
        <div
          className="iconChevronUp asideIcon"
          onClick={this.handleUpClick}
          title="Scroll up"
        ></div>
        <div
          className="iconChevronDown asideIcon"
          onClick={this.handleDownClick}
          title="Scroll down"
        ></div>
        {renderIf(
          recipes && recipes.length > 0,
          <div className="recipesSection">
            {recipes.map((myRecipe, idx) => {
              let boundRecipeClick = this.handleBoundRecipeClick.bind(
                this,
                myRecipe
              );
              let boundFavoriteClick = this.handleBoundFavoriteClick.bind(
                this,
                myRecipe
              );
              let likedRecipe =
                this.props.favorites &&
                this.props.favorites.some(
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
                      className="lazyload cardImage"
                      data-src={myRecipe.recipe.image}
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
                      hideLike: !this.props.userAuth,
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
                    <div className="cardInfoDiv" title={myRecipe.recipe.label}>
                      <h3 className="cardTitle">{myRecipe.recipe.label} </h3>
                      <p className="healthLabels">
                        {myRecipe.recipe.healthLabels.join(', ')}{' '}
                      </p>
                      <p className="calsAndIngreds">
                        <span className="tileCalorieText">
                          {' '}
                          <span className="tileCalorieTextNumber">
                            {' '}
                            {this.calsPS(
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
                          <span className="ingredientsSpan"> INGREDIENTS</span>
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
        <div
          className={classToggler({
            sliderPopup: true,
            clozed: this.state.userSuccess,
          })}
          onClick={() => this.setState({ userSuccess: false })}
        >
          <p>{this.state.userSuccessMessage}</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userAuth: state.userAuth,
  favorites: state.favorites,
});

const mapDispatchToProps = dispatch => ({
  favoriteFetch: favorite => dispatch(favoriteFetchRequest(favorite)),
  recipeFetchRequest: recipe => dispatch(recipeFetch(recipe)),
  favoriteDelete: favorite => dispatch(favoriteDeleteRequest(favorite)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipesMap);
