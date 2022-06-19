import React from 'react';
import { connect } from 'react-redux';

import Footer from '../footer';
import RecipesMap from '../recipes-map';
import {
  homepageFetchRequest,
  homepageFetch,
  recipesFetchRequest,
  recipesFetch,
} from '../../actions/search-actions.js';
import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import { favoritesFetchRequest } from '../../actions/favorite-actions.js';
import { logged } from '../../actions/log-actions.js';
import { userValidation, logError, renderIf } from './../../lib/util.js';
import './../../style/main.scss';

class LandingContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { slideWidth: 270 };
  }

  componentWillMount() {
    userValidation(this.props);
    if (
      localStorage.random0 &&
      JSON.parse(localStorage.getItem('random0'))['timestamp'] >
        new Date().getTime()
    ) {
      this.props.homepageFetchRequest(
        JSON.parse(localStorage.getItem('random0'))['content']
      );
    } else if (!this.props.homepage || this.props.homepage.length == 0) {
      this.props.homepageFetch(0).catch(err => logError(err));
    }
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    this.updateSlideWidth();
    window.addEventListener('resize', this.updateSlideWidth);
    document.addEventListener('scroll', this.trackScrolling);
    if (!this.props.log) {
      this.props.loggedRequest(true);
      console.log(
        'If you have any questions about my code please email me @BrianBixby0@gmail.com and visit https://www.builtbybixby.us to see my latest projects.'
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSlideWidth);
    document.removeEventListener('scroll', this.trackScrolling);
  }

  updateSlideWidth = () => {
    if (window.innerWidth < 480) {
      this.setState({ slideWidth: 270 });
    } else if (window.innerWidth < 640) {
      this.setState({ slideWidth: 340 });
    } else if (window.innerWidth < 768) {
      this.setState({ slideWidth: 440 });
    } else if (window.innerWidth < 1200) {
      this.setState({ slideWidth: 500 });
    } else {
      this.setState({ slideWidth: 550 });
    }
  };

  handleBoundItemClick = (item, e) => {
    let queryString = item.link.split('&calories=0-10000')[0];
    let queryParams = '&calories=0-10000';

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
      return this.props.history.push(`/search/${queryString}${queryParams}`);
    }
    return this.props
      .recipesFetch(queryString, queryParams, 0, false)
      .then(() =>
        this.props.history.push(`/search/${queryString}${queryParams}`)
      )
      .catch(err => logError(err));
  };

  handleBoundSubitemClick = (subItem, e) => {
    let queryString = subItem.link.split('&calories=0-10000')[0];
    let queryParams = '&calories=0-10000';

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
      return this.props.history.push(`/search/${queryString}${queryParams}`);
    }

    let min = 0;
    let infiniteSearch = false;
    return this.props
      .recipesFetch(queryString, queryParams, min, infiniteSearch)
      .then(() =>
        this.props.history.push(`/search/${queryString}${queryParams}`)
      )
      .catch(err => logError(err));
  };

  handleRedirect = url => {
    return this.props.history.push(url);
  };

  calsPS = (cals, servings) => Math.round(cals / servings);

  handleRightClick = () => {
    this.refs.subItemScroller
      ? (this.refs.subItemScroller.scrollLeft += window.innerWidth)
      : null;
  };

  handleLeftClick = () => {
    this.refs.subItemScroller
      ? (this.refs.subItemScroller.scrollLeft -= window.innerWidth)
      : null;
  };

  handleSliderRightClick = () => {
    this.refs.sliderScroller
      ? (this.refs.sliderScroller.scrollLeft += this.state.slideWidth)
      : null;
  };

  handleSliderLeftClick = () => {
    this.refs.sliderScroller
      ? (this.refs.sliderScroller.scrollLeft -= this.state.slideWidth)
      : null;
  };

  isBottom = el => {
    return el.getBoundingClientRect().bottom <= window.innerHeight + 1500;
  };

  trackScrolling = () => {
    document.removeEventListener('scroll', this.trackScrolling);
    const wrappedElement = document.getElementById('homeContainer');
    if (
      this.isBottom(wrappedElement) &&
      this.props.homepage &&
      this.props.homepage &&
      this.props.homepage.length < 96
    ) {
      let min = this.props.homepage.length.toString();
      if (
        localStorage.getItem(`random${min}`) &&
        JSON.parse(localStorage.getItem(`random${min}`))['timestamp'] >
          new Date().getTime()
      ) {
        this.props.homepageFetchRequest(
          JSON.parse(localStorage.getItem(`random${min}`))['content']
        );
        return document.addEventListener('scroll', this.trackScrolling);
      } else {
        return this.props
          .homepageFetch(min)
          .then(() => document.addEventListener('scroll', this.trackScrolling))
          .catch(err => logError(err));
      }
    }
    document.addEventListener('scroll', this.trackScrolling);
  };

  render() {
    const sliderItems = [
      {
        header: 'Sensational Sangria Recipes',
        subHeader:
          'Browse hundreds of variations on this fun and fruity punch.',
        image: require('./../helpers/assets/1.png'),
        link: 'search?q=sangria&calories=0-10000',
      },
      {
        header: 'Hummus Recipes',
        subHeader: 'Browse hundreds of ways to get your dip on.',
        image: require('./../helpers/assets/2.png'),
        link: 'search?q=hummus&calories=0-10000',
      },
      {
        header: 'Greek Pasta Salad',
        subHeader:
          'These salads are filled with bold flavors: kalamata olives, feta cheese and fresh herbs.',
        image: require('./../helpers/assets/3.png'),
        link: 'search?q=greek%20pasta%20salad&calories=0-10000',
      },
      {
        header: 'Sloppy Bulgogi and other Fusion Mashups.',
        subHeader: 'Try these delicious cross-cultural combos.',
        image: require('./../helpers/assets/4.png'),
        link: 'search?q=fusion&calories=0-10000',
      },
      {
        header: 'Chicken Teriyaki Skewers',
        subHeader:
          'See how to make delicious Summery chicken teriyaki skewers.',
        image: require('./../helpers/assets/5.png'),
        link: 'search?q=chicken%20teriyaki%20skewers&calories=0-10000',
      },
    ];

    const subItems = [
      {
        title: 'World Cuisine',
        image: require('./../helpers/assets/6.png'),
        link: 'search?q=world%20cuisine&calories=0-10000',
      },
      {
        title: 'Vegan Recipes',
        image: require('./../helpers/assets/7.png'),
        link: 'search?q=vegan&calories=0-10000',
      },
      {
        title: 'Slow Cooker',
        image: require('./../helpers/assets/8.png'),
        link: 'search?q=slow%20cooker&calories=0-10000',
      },
      {
        title: 'Shrimp Recipes',
        image: require('./../helpers/assets/9.png'),
        link: 'search?q=shrimp&calories=0-10000',
      },
      {
        title: 'Cookies',
        image: require('./../helpers/assets/10.png'),
        link: 'search?q=cookie&calories=0-10000',
      },
      {
        title: 'Chicken Recipes',
        image: require('./../helpers/assets/11.png'),
        link: 'search?q=chicken&calories=0-10000',
      },
      {
        title: 'Cake Recipes',
        image: require('./../helpers/assets/12.png'),
        link: 'search?q=cake&calories=0-10000',
      },
      {
        title: 'Breakfast',
        image: require('./../helpers/assets/13.png'),
        link: 'search?q=breakfast&calories=0-10000',
      },
      {
        title: 'Bread Recipes',
        image: require('./../helpers/assets/14.png'),
        link: 'search?q=bread&calories=0-10000',
      },
      {
        title: 'Appetizers',
        image: require('./../helpers/assets/15.png'),
        link: 'search?q=appetizers&calories=0-10000',
      },
    ];
    return (
      <div className="main">
        <section id="homeContainer" className="container">
          <div className="sliderContainer">
            <div className="slider" ref="sliderScroller">
              {sliderItems.map((item, idx) => {
                let boundItemClick = this.handleBoundItemClick.bind(this, item);
                return (
                  <div
                    key={idx}
                    className="sliderItemContainer"
                    onClick={boundItemClick}
                    title={item.header}
                  >
                    <div className="sliderText">
                      <h3 className="sliderHeader">{item.header}</h3>
                      <p className="sliderSubheader">{item.subHeader}</p>
                    </div>
                    <img src={item.image} className="sliderItemImage" />
                  </div>
                );
              })}
            </div>
            <div
              className="sliderIconChevronLeft sliderIcon"
              onClick={this.handleSliderLeftClick}
              title="Scroll right"
            ></div>
            <div
              className="sliderIconChevronRight sliderIcon"
              onClick={this.handleSliderRightClick}
              title="Scroll left"
            ></div>
          </div>
          <div className="sliderSubItemWrapper">
            <div className="sliderSubItem" ref="subItemScroller">
              <div className="subItemInnerWrapper">
                {subItems.map((subItem, idx) => {
                  let boundSubitemClick = this.handleBoundSubitemClick.bind(
                    this,
                    subItem
                  );
                  return (
                    <div
                      key={idx}
                      className="sliderSubitemContainer"
                      onClick={boundSubitemClick}
                      title={subItem.title}
                    >
                      <div className="subItemInsideWrapper">
                        <img
                          src={subItem.image}
                          className="sliderSubitemImage"
                        />
                        <p className="sliderSubitemTitle">{subItem.title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              className="iconChevronLeft subItemIcon"
              onClick={this.handleLeftClick}
              title="Scroll left"
            ></div>
            <div
              className="iconChevronRight subItemIcon"
              onClick={this.handleRightClick}
              title="Scroll right"
            ></div>
          </div>
          <RecipesMap
            recipes={this.props.homepage}
            containerClass={'homepageRecipesOuter'}
            redirect={this.handleRedirect}
          />
          <div>
            {renderIf(
              this.props.homepage && this.props.homepage.length >= 96,
              <div className="infiniteScrollMax">
                <p>Sorry, but the API limits our query results. </p>
              </div>
            )}
          </div>
        </section>
        <Footer />
      </div>
    );
  }
}

let mapStateToProps = state => ({
  homepage: state.homepage,
  log: state.log,
});

let mapDispatchToProps = dispatch => {
  return {
    favoritesFetch: favoritesArr =>
      dispatch(favoritesFetchRequest(favoritesArr)),
    userProfileFetch: () => dispatch(userProfileFetchRequest()),
    tokenSignIn: token => dispatch(tokenSignInRequest(token)),
    homepageFetch: min => dispatch(homepageFetchRequest(min)),
    homepageFetchRequest: recipes => dispatch(homepageFetch(recipes)),
    recipesFetch: (queryString, queryParams, min, infiniteSearch) =>
      dispatch(
        recipesFetchRequest(queryString, queryParams, min, infiniteSearch)
      ),
    recipesFetchRequest: recipes => dispatch(recipesFetch(recipes)),
    loggedRequest: val => dispatch(logged(val)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);
