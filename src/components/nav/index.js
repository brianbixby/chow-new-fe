import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import Avatar from '../helpers/avatar';
import Modal from '../helpers/modal';
import SearchBar from '../searchBar';
import UserAuthForm from '../userAuth-form';
import { signOut } from '../../actions/userAuth-actions.js';
import {
  recipesFetchRequest,
  recipesFetch,
} from '../../actions/search-actions.js';
import {
  signUpRequest,
  signInRequest,
} from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import { favoritesFetchRequest } from '../../actions/favorite-actions.js';
import { logError, renderIf, classToggler } from '../../lib/util.js';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showBrowse: false,
      showSearchBarSmall: false,
      authFormAction: 'Sign Up',
      formDisplay: false,
      userSuccess: false,
      dropDownDisplay: false,
    };
  }

  handleSignOut = () => {
    this.setState({ dropDownDisplay: !this.state.dropDownDisplay });
    if (
      window.location.pathname == `/profile/${this.props.userProfile.username}`
    )
      this.props.history.push('/');
    this.props.signOut();
    this.handleUserSuccess();
  };

  handleSignin = (user, errCB) => {
    return this.props
      .signIn(user)
      .then(() => {
        return this.props.userProfileFetch().catch(err => logError(err));
      })
      .then(profile => {
        return this.props
          .favoritesFetch(profile.body)
          .catch(err => logError(err));
      })
      .then(() => {
        this.setState({ formDisplay: false });
        this.handleUserSuccess();
      })
      .catch(err => {
        logError(err);
        errCB(err);
      });
  };

  handleSignup = (user, errCB) => {
    return this.props
      .signUp(user)
      .then(() => {
        return this.props.userProfileFetch().catch(err => logError(err));
      })
      .then(profile => {
        return this.props
          .favoritesFetch(profile.body)
          .catch(err => logError(err));
      })
      .then(() => {
        this.setState({ formDisplay: false });
        this.handleUserSuccess();
      })
      .catch(err => {
        logError(err);
        errCB(err);
      });
  };

  handleSearch = (queryString, queryParams) => {
    return this.props
      .recipesFetch(queryString, queryParams, 0, false)
      .then(() => {
        return this.props.history.push(`/search/${queryString}${queryParams}`);
      })
      .catch(err => logError(err));
  };

  handleProfileDivClick = e => {
    this.setState({ showBrowse: false, showSearchBarSmall: false });
    this.props.userAuth
      ? this.setState({ dropDownDisplay: !this.state.dropDownDisplay })
      : this.setState({ formDisplay: true });
  };

  handleProfileLinkClick = e => {
    this.setState({ dropDownDisplay: false });
    this.props.history.push(`/profile/${this.props.userProfile.username}`);
  };

  handleboundCatClick = (item, e) => {
    let queryString = item.link.split('&calories=0-10000')[0];
    let queryParams = item.link.split(queryString)[1];

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
      this.setState({ showBrowse: false });
      return this.props.history.push(`/search/${queryString}${queryParams}`);
    }

    return this.props
      .recipesFetch(queryString, queryParams, 0, false)
      .then(() => {
        this.setState({ showBrowse: false });
        return this.props.history.push(`/search/${queryString}${queryParams}`);
      })
      .catch(err => logError(err));
  };

  handleUserSuccess = () => {
    this.setState({ userSuccess: true });
    setTimeout(() => this.setState({ userSuccess: false }), 5000);
  };

  handleRedirect = url => {
    return this.props.history.push(url);
  };

  render() {
    const categories = [
      {
        category: 'Meal Type',
        subCategory: [
          {
            title: 'Appetizers & Snacks',
            link: 'search?q=appetizer&calories=0-10000',
          },
          {
            title: 'Breakfast & Brunch',
            link: 'search?q=brunch&calories=0-10000',
          },
          { title: 'Desserts', link: 'search?q=dessert&calories=0-10000' },
          { title: 'Dinner', link: 'search?q=dinner&calories=0-10000' },
          { title: 'Drinks', link: 'search?q=drink&calories=0-10000' },
        ],
      },
      {
        category: 'Ingredient',
        subCategory: [
          { title: 'Beef', link: 'search?q=beef&calories=0-10000' },
          { title: 'Chicken', link: 'search?q=chicken&calories=0-10000' },
          { title: 'Pasta', link: 'search?q=pasta&calories=0-10000' },
          { title: 'Pork', link: 'search?q=pork&calories=0-10000' },
          { title: 'Salmon', link: 'search?q=salmon&calories=0-10000' },
        ],
      },
      {
        category: 'Diet & Health',
        subCategory: [
          {
            title: 'High Protein',
            link: 'search?q=&calories=0-10000&diet=high-protein',
          },
          {
            title: 'Low Carb',
            link: 'search?q=&calories=0-10000&diet=low-carb',
          },
          {
            title: 'Peanut Free',
            link: 'search?q=&calories=0-10000&health=peanut-free',
          },
          { title: 'Vegan', link: 'search?q=&calories=0-10000&health=vegan' },
          {
            title: 'Vegetarian',
            link: 'search?q=&calories=0-10000&health=vegetarian',
          },
        ],
      },
      {
        category: 'Cuisine Type',
        subCategory: [
          { title: 'Italian', link: 'search?q=italian&calories=0-10000' },
          { title: 'Mexican', link: 'search?q=mexican&calories=0-10000' },
          { title: 'Chinese', link: 'search?q=chinese&calories=0-10000' },
          { title: 'Indian', link: 'search?q=indian&calories=0-10000' },
          { title: 'French', link: 'search?q=french&calories=0-10000' },
        ],
      },
    ];
    const spoon = require('./../helpers/assets/icons/spoon.icon.svg');
    const chevron = require('./../helpers/assets/icons/chevron-down.icon.svg');
    const user = require('./../helpers/assets/icons/user.icon.svg');
    let profileImage =
      this.props.userProfile && this.props.userProfile.image ? (
        <Avatar url={this.props.userProfile.image} />
      ) : (
        <img className="noProfileImageNav" src={user} />
      );
    let profileText =
      this.props.userAuth &&
      this.props.userProfile &&
      this.props.userProfile.username
        ? this.props.userProfile.username
        : 'Sign Up/ Sign In';
    let handleComplete =
      this.state.authFormAction === 'Sign Up'
        ? this.handleSignup
        : this.handleSignin;
    let userSuccessMessage =
      this.state.authFormAction === 'Sign Up' ? 'Signed up!' : 'Logged in.';
    let profile = this.props.userProfile;
    let showNotification =
      this.props.userProfile && !this.props.userProfile.image ? true : false;
    return (
      <div>
        <div className="navBanner">
          <ul className="socialMediaBar">
            <li>Follow me on:</li>
            <li>
              <a
                href="https://github.com/brianbixby"
                rel="noopener noreferrer"
                target="_blank"
                title="Github"
              >
                <span className="githubSpan"></span>{' '}
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/brianbixby1/"
                rel="noopener noreferrer"
                target="_blank"
                title="Linkedin"
              >
                <span className="linkedinSpan"></span>
              </a>
            </li>
          </ul>
          <span className="test"></span>
          <a
            className="portfolioLink"
            href="https://www.builtbybixby.us"
            rel="noopener noreferrer"
            target="_blank"
            title="BuiltByBixby.us"
          >
            Check out my portfolio
          </a>
        </div>
        <nav>
          <div className="homeLinkDiv" title="Home">
            <Link to="/" className="homeLink">
              chow{' '}
              <span className="spoonContainer">
                <img src={spoon} className="spoon" />
              </span>
            </Link>
          </div>
          <div
            className="browseDiv"
            onClick={() =>
              this.setState({
                showBrowse: !this.state.showBrowse,
                dropDownDisplay: false,
              })
            }
          >
            <p>
              <span>BROWSE</span> <img src={chevron} />
            </p>
          </div>
          {renderIf(
            this.state.showBrowse,
            <div className="browsePopup">
              <div className="browseWrapper">
                <div className="linksGrid">
                  <ul className="browseSections">
                    {categories.map((cat, idx) => {
                      return (
                        <li key={idx} className="browseCategories">
                          <h3>{cat.category}</h3>
                          <span className="iconRight"></span>
                          <ul className="browseSubCategories">
                            {cat.subCategory.map((sub, subindex) => {
                              let boundCatClick = this.handleboundCatClick.bind(
                                this,
                                sub
                              );
                              return (
                                <li key={subindex} onClick={boundCatClick}>
                                  <p>{sub.title}</p>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}
          <SearchBar
            onComplete={this.handleSearch}
            redirect={this.handleRedirect}
            advancedSearch={() =>
              this.setState({
                dropDownDisplay: false,
                showBrowse: false,
                showSearchBarSmall: false,
              })
            }
            showSearchBarSmall={this.state.showSearchBarSmall}
          />
          <div
            onClick={() =>
              this.setState({
                showSearchBarSmall: !this.state.showSearchBarSmall,
                dropDownDisplay: false,
              })
            }
            className={classToggler({
              navSearchIcon: true,
              showSearchBarSmall: this.state.showSearchBarSmall,
            })}
          >
            <div className="navSearchIconInner">
              <span className="navSearchIconSpan"></span>
            </div>
          </div>

          <div
            onClick={this.handleProfileDivClick}
            className={classToggler({
              navProfileDiv: true,
              activeProfileDiv: this.state.dropDownDisplay,
            })}
          >
            <div className="navProfileDivInner">
              <div className="profileImageDiv">
                {profileImage}
                <span>
                  {showNotification && (
                    <span
                      className="notificationAlert"
                      title="Upload an image and complete your profile"
                    >
                      1
                    </span>
                  )}
                </span>
              </div>
              <div className="profileTextDiv">
                <p className="profileText">{profileText}</p>
              </div>
            </div>
          </div>
          {renderIf(
            this.state.formDisplay,
            <div>
              <Modal
                heading="Chow"
                close={() => this.setState({ formDisplay: false })}
              >
                <UserAuthForm
                  authFormAction={this.state.authFormAction}
                  onComplete={handleComplete}
                />

                <div className="userauth-buttons">
                  {renderIf(
                    this.state.authFormAction === 'Sign In',
                    <button
                      className="b-button dark-button"
                      onClick={() =>
                        this.setState({ authFormAction: 'Sign Up' })
                      }
                    >
                      Sign Up
                    </button>
                  )}

                  {renderIf(
                    this.state.authFormAction === 'Sign Up',
                    <button
                      className="b-button dark-button"
                      onClick={() =>
                        this.setState({ authFormAction: 'Sign In' })
                      }
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </Modal>
            </div>
          )}
          <div
            className={classToggler({
              profileDropDown: true,
              showProfileDropDown: this.state.dropDownDisplay,
            })}
          >
            <div className="profileDropDownWrapper">
              <div className="profileLinkWrapper">
                <p
                  className="profileLink"
                  onClick={this.handleProfileLinkClick}
                >
                  <svg className="profileLinkImage">
                    <use xlinkHref="#navProfileIcon" />
                  </svg>
                  <span className="profileLinkText">Profile</span>
                </p>
              </div>
              <div className="signOutWrapper" onClick={this.handleSignOut}>
                <p className="signOut"> Sign Out</p>
              </div>
            </div>
          </div>
          <div
            className={classToggler({
              sliderPopup: true,
              clozed: this.state.userSuccess,
            })}
            onClick={() => this.setState({ userSuccess: false })}
          >
            {renderIf(profile, <p>{userSuccessMessage}</p>)}
            {renderIf(!profile, <p>Logged out.</p>)}
          </div>
        </nav>
        <svg display="none">
          <symbol
            id="navProfileIcon"
            viewBox="-14.55 -14.55 223.1 223.1"
            width="46"
            height="46"
          >
            <path d="M3932.18 2033.43l-27.19-55.09-27.21 55.09-60.78 8.87 44.07 42.9-10.4 60.53 54.36-28.62 54.46 28.56-10.42-60.57 43.93-42.86-60.82-8.81z" />
            <path d="M4160.95 2117.13v-138.72l-.05-.11-27.1 55.12-60.85 8.85 44.04 42.91-10.38 60.55 54.34-28.6z" />
            <path d="M4248.95 2042.29l-60.8-8.81-27.2-55.01v138.72l.04-.02 54.46 28.56-10.47-60.58 43.97-42.86z" />
            <path d="M177 153.16H17v-111h160v111zm-153-6.94h146V49.09H24v97.12z" />
            <path d="M92 106s-4.65-6-15.8-8.73a17.57 17.57 0 1 0-22.52.13 35.26 35.26 0 0 0-15.09 7.83 3.31 3.31 0 0 0-.9.85 3.55 3.55 0 0 0-.48.92 3.63 3.63 0 0 0-.16 1v23.18h55.67V108a3 3 0 0 0-.18-1 2.48 2.48 0 0 0-.54-1zM111.69 79.42h47.83v9.54h-47.83zM111.69 100.53h47.83v9.53h-47.83zM111.69 121.65h47.83v9.54h-47.83z" />
          </symbol>
        </svg>
      </div>
    );
  }
}

let mapStateToProps = state => ({
  userAuth: state.userAuth,
  userProfile: state.userProfile,
});

let mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(signOut()),
  recipesFetch: (queryString, queryParams, min, infiniteSearch) =>
    dispatch(
      recipesFetchRequest(queryString, queryParams, min, infiniteSearch)
    ),
  recipesFetchRequest: recipes => dispatch(recipesFetch(recipes)),
  signUp: user => dispatch(signUpRequest(user)),
  signIn: user => dispatch(signInRequest(user)),
  favoritesFetch: favoritesArr => dispatch(favoritesFetchRequest(favoritesArr)),
  userProfileFetch: () => dispatch(userProfileFetchRequest()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));
