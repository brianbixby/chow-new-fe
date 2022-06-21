import React from 'react';
import { connect } from 'react-redux';
import { isInt } from 'validator';

import { recipesFetch } from '../../actions/search-actions.js';
import Tooltip from '../helpers/tooltip';
import { renderIf, classToggler } from './../../lib/util.js';
import magnify from './../helpers/assets/icons/magnify.icon.svg';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advancedSearch: false,
      searchTerm: '',
      exclude: '',
      excludedArr: [],
      minCals: '',
      minCalsError: null,
      maxCals: '',
      maxCalsError: null,
      maxIngredients: '',
      maxIngredientsError: null,
      dietOption: false,
      healthOption: false,
      error: null,
      focused: null,
      submitted: false,
      width: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDimensions);
    this.updateWindowDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
    this.setState({
      advancedSearch: false,
      searchTerm: '',
      exclude: '',
      excludeError: null,
      excludedArr: [],
      minCals: '',
      maxCals: '',
      maxIngredients: '',
      dietOption: false,
      healthOption: false,
    });
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  validateInput = e => {
    let { name, value } = e.target;
    let errors = {
      minCalsError: this.state.minCalsError,
      maxCalsError: this.state.maxCalsError,
      maxIngredientsError: this.state.maxIngredientsError,
    };
    let setError = (name, error) => (errors[`${name}Error`] = error);
    let deleteError = name => (errors[`${name}Error`] = null);

    if (name === 'minCals' || name === 'maxCals' || name === 'maxIngredients') {
      if (value && !isInt(value)) {
        setError(name, `${name} must be a number`);
      } else {
        deleteError(name);
      }
    }

    this.setState({
      ...errors,
      error: !!(
        errors.minCalsError ||
        errors.maxCalsError ||
        errors.maxIngredients
      ),
    });
  };

  handleFocus = e => this.setState({ focused: e.target.name });

  handleBlur = e => {
    let { name } = e.target;
    this.setState(state => ({
      focused: state.focused == name ? null : state.focused,
    }));
  };

  handleChange = e => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleRadioClick = e => {
    let { name, value } = e.target;
    this.state[name] === value
      ? this.setState({ [name]: '' })
      : this.setState({ [name]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (!this.state.error) {
      let minCals = !this.state.minCals ? '0' : this.state.minCals;
      let maxCals = !this.state.maxCals ? '10000' : this.state.maxCals;
      let ingredients = this.state.maxIngredients
        ? `&ingr=${this.state.maxIngredients}`
        : '';
      let diet = this.state.dietOption ? `&diet=${this.state.dietOption}` : '';
      let health = this.state.healthOption
        ? `&health=${this.state.healthOption}`
        : '';
      let exclude = '';
      if (this.state.excludedArr.length > 0) {
        let shallowCopyExcludedArr = this.state.excludedArr.map(
          el => `&excluded=${el}`
        );
        exclude = shallowCopyExcludedArr.join('');
      }
      let queryParams = `&calories=${minCals}-${maxCals}${health}${diet}${ingredients}${exclude}`;
      let queryString = this.state.searchTerm
        ? `search?q=${this.state.searchTerm}`
        : 'search?q=';

      if (
        localStorage.getItem(`${queryString}${queryParams}0`) &&
        JSON.parse(localStorage.getItem(`${queryString}${queryParams}0`))[
          'timestamp'
        ] > new Date().getTime()
      ) {
        this.props.recipesFetchRequest(
          JSON.parse(localStorage.getItem(`${queryString}${queryParams}0`))[
            'content'
          ]
        );
        this.props.redirect(`/search/${queryString}${queryParams}`);
        this.props.advancedSearch();
        this.setState({ advancedSearch: false });
      } else {
        this.props.onComplete(queryString, queryParams).then(() => {
          this.props.advancedSearch();
          this.setState({ advancedSearch: false });
        });
      }
    }
    this.setState(state => ({
      submitted: true,
      minCalsError: !state.minCalsError ? null : 'required',
      maxCalsError: !state.maxCalsError ? null : 'required',
      maxIngredientsError: !state.maxIngredientsError ? null : 'required',
    }));
  };

  handleExclude = () => {
    this.setState({
      excludedArr: [...this.state.excludedArr, this.state.exclude],
      exclude: '',
    });
  };

  handleBoundExcludeClick = exclude => {
    this.setState({
      excludedArr: this.state.excludedArr.filter(
        excluded => excluded !== exclude
      ),
    });
  };

  handleAdvancedSearch = () => {
    this.props.advancedSearch();
    this.setState({ advancedSearch: !this.state.advancedSearch });
  };

  render() {
    let {
      searchTerm,
      minCalsError,
      maxCalsError,
      maxIngredientsError,
      advancedSearch,
      error,
      focused,
      submitted,
    } = this.state;

    return (
      <div
        className={classToggler({
          searchContainer: true,
          hideSearchBar:
            !this.props.showSearchBarSmall && this.state.width < 768,
        })}
      >
        <form
          onSubmit={this.handleSubmit}
          className={classToggler({
            searchForm: true,
            form: true,
            error: error && submitted,
          })}
        >
          <div
            className={classToggler({
              'input-group': true,
              hideSearchBar:
                this.props.showSearchBarSmall && this.state.width < 768,
            })}
          >
            <input
              className="form-control search-form"
              type="text"
              name="searchTerm"
              placeholder="Find a recipe"
              value={searchTerm}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
            <div
              className="advancedSearchButton"
              onClick={this.handleAdvancedSearch}
            >
              <p>Advanced Search</p>
            </div>
            <button type="submit" className="btn search-btn">
              <img src={magnify} alt="Magnify icon" />
            </button>
          </div>
          {renderIf(
            advancedSearch ||
              (this.props.showSearchBarSmall && this.state.width < 768),
            <div className="advancedSearchDiv">
              <span
                className="iconClose"
                onClick={() =>
                  this.setState({ advancedSearch: !this.state.advancedSearch })
                }
              >
                {' '}
              </span>
              <div className="inputWrapper keyWords">
                <span className="magnifyingGlassIcon"></span>
                <input
                  className="keyWordsInput"
                  type="text"
                  name="searchTerm"
                  placeholder="Find a recipe"
                  value={searchTerm}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                />
              </div>
              <div className="inputWrapper exclude">
                <div className="excludeInner">
                  <div className="addExclude">
                    <input
                      className="excludeInput"
                      type="text"
                      name="exclude"
                      placeholder="Exclude Ingredients"
                      value={this.state.exclude}
                      onChange={this.handleChange}
                      onFocus={this.handleFocus}
                      onBlur={this.handleBlur}
                    />
                  </div>
                </div>
                <p className="excludeButton" onClick={this.handleExclude}>
                  <span>—</span>
                </p>
              </div>
              {renderIf(
                this.state.excludedArr.length > 0,
                <div className="excludedDiv">
                  {this.state.excludedArr.map((exclude, idx) => {
                    let boundExcludeClick = this.handleBoundExcludeClick.bind(
                      this,
                      exclude
                    );
                    return (
                      <p
                        key={idx}
                        onClick={boundExcludeClick}
                        className="excludedP"
                      >
                        <span className="excludedItem">{exclude}</span>
                        <span className="xButton">X</span>
                      </p>
                    );
                  })}
                </div>
              )}
              <div className="calSection">
                <span className="advancedSearchSectionHeader">Calories</span>
                <span className="subSection calSubSection">
                  From
                  <input
                    id="textBoxInputMinCal"
                    type="text"
                    name="minCals"
                    placeholder="ex. 200"
                    value={this.state.minCals}
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                  />
                </span>
                <span className="subSection calSubSection">
                  To
                  <input
                    id="textBoxInputMaxCal"
                    type="text"
                    name="maxCals"
                    placeholder="ex. 600"
                    value={this.state.maxCals}
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                  />
                </span>
                <span className="advancedSearchSectionHeader mt16 mt50small">
                  Ingredients
                </span>
                <span className="subSection calSubSection mw180">
                  Up to
                  <input
                    id="textBoxInputMaxResults"
                    type="text"
                    name="maxIngredients"
                    placeholder="Max Ingredients ex. 12"
                    value={this.state.maxIngredients}
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                  />
                </span>
              </div>
              <div className="healthSection">
                <span className="advancedSearchSectionHeader mt50small">
                  Health (click one){' '}
                </span>
                <label>
                  <input
                    type="radio"
                    name="healthOption"
                    value="peanut-free"
                    onChange={this.handleRadioClick}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    checked={this.state.healthOption === 'peanut-free'}
                  />
                  <span>Peanut Free</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="healthOption"
                    value="sugar-conscious"
                    onChange={this.handleRadioClick}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    checked={this.state.healthOption === 'sugar-conscious'}
                  />
                  <span>Sugar Conscious</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="healthOption"
                    value="tree-nut-free"
                    onChange={this.handleRadioClick}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    checked={this.state.healthOption === 'tree-nut-free'}
                  />
                  <span>Tree Nut Free</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="healthOption"
                    value="vegan"
                    onChange={this.handleRadioClick}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    checked={this.state.healthOption === 'vegan'}
                  />
                  <span>Vegan</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="healthOption"
                    value="vegetarian"
                    onChange={this.handleRadioClick}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    checked={this.state.healthOption === 'vegetarian'}
                  />
                  <span>Vegetarian</span>
                </label>
              </div>
              <div className="dietSection">
                <span className="advancedSearchSectionHeader mt10small">
                  Diet (click one)
                </span>
                <div className="allergyFormGroup form-group">
                  <label>
                    <input
                      type="radio"
                      name="dietOption"
                      value="balanced"
                      onChange={this.handleRadioClick}
                      onFocus={this.handleFocus}
                      onBlur={this.handleBlur}
                      checked={this.state.dietOption === 'balanced'}
                    />
                    <span>Balanced</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="dietOption"
                      value="high-protein"
                      onChange={this.handleRadioClick}
                      onFocus={this.handleFocus}
                      onBlur={this.handleBlur}
                      checked={this.state.dietOption === 'high-protein'}
                    />
                    <span>High Protein</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="dietOption"
                      value="low-carb"
                      onChange={this.handleRadioClick}
                      onFocus={this.handleFocus}
                      onBlur={this.handleBlur}
                      checked={this.state.dietOption === 'low-carb'}
                    />
                    <span>Low Carb</span>
                  </label>
                </div>
                <button id="advancedSearchFormButton" type="submit">
                  Go
                </button>
              </div>
              <div className="advancedSearchToolTip">
                <Tooltip
                  message={minCalsError}
                  show={focused === 'minCals' || submitted}
                />
                <Tooltip
                  message={maxCalsError}
                  show={focused === 'maxCals' || submitted}
                />
                <Tooltip
                  message={maxIngredientsError}
                  show={focused === 'maxIngredients' || submitted}
                />
              </div>
            </div>
          )}
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  recipesFetchRequest: recipes => dispatch(recipesFetch(recipes)),
});

export default connect(null, mapDispatchToProps)(SearchBar);
