import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
import image1 from './../helpers/assets/1.png';
import image2 from './../helpers/assets/2.png';
import image3 from './../helpers/assets/3.png';
import image4 from './../helpers/assets/4.png';
import image5 from './../helpers/assets/5.png';
import image6 from './../helpers/assets/6.png';
import image7 from './../helpers/assets/7.png';
import image8 from './../helpers/assets/8.png';
import image9 from './../helpers/assets/9.png';
import image10 from './../helpers/assets/10.png';
import image11 from './../helpers/assets/11.png';
import image12 from './../helpers/assets/12.png';
import image13 from './../helpers/assets/13.png';
import image14 from './../helpers/assets/14.png';
import image15 from './../helpers/assets/15.png';
import './../../style/main.scss';

function LandingContainer(props) {
  let navigate = useNavigate();
  let subItemScrollerRef = React.createRef();
  let sliderScrollerRef = React.createRef();
  const [slideWidth, setSlideWidth] = useState(270);

  useEffect(() => {
    userValidation(props, navigate);
    if (
      localStorage.random0 &&
      JSON.parse(localStorage.getItem('random0'))['timestamp'] >
        new Date().getTime()
    ) {
      props.homepageFetchRequest(
        JSON.parse(localStorage.getItem('random0'))['content']
      );
    } else if (!props.homepage || props.homepage.length == 0) {
      props.homepageFetch(0).catch(err => logError(err));
    }
    updateSlideWidth();
    window.scrollTo(0, 0);
    window.addEventListener('resize', updateSlideWidth);
    document.addEventListener('scroll', trackScrolling);
    if (!props.log) {
      props.loggedRequest(true);
      console.log(
        'If you have any questions about my code please email me @BrianBixby0@gmail.com and visit https://www.builtbybixby.us to see my latest projects.'
      );
    }
  }, []);

  //   componentWillUnmount() {
  //     window.removeEventListener('resize', updateSlideWidth);
  //     document.removeEventListener('scroll', trackScrolling);
  //   }

  const updateSlideWidth = () => {
    if (window.innerWidth < 480) {
      setSlideWidth(270);
    } else if (window.innerWidth < 640) {
      setSlideWidth(340);
    } else if (window.innerWidth < 768) {
      setSlideWidth(440);
    } else if (window.innerWidth < 1200) {
      setSlideWidth(500);
    } else {
      setSlideWidth(550);
    }
  };

  const handleBoundItemClick = item => {
    let queryString = item.link.split('&calories=0-10000')[0];
    let queryParams = '&calories=0-10000';

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
      return navigate(`/search/${queryString}${queryParams}`);
    }
    return props
      .recipesFetch(queryString, queryParams, 0, false)
      .then(() => navigate(`/search/${queryString}${queryParams}`))
      .catch(err => logError(err));
  };

  const handleBoundSubitemClick = subItem => {
    let queryString = subItem.link.split('&calories=0-10000')[0];
    let queryParams = '&calories=0-10000';

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
      return navigate(`/search/${queryString}${queryParams}`);
    }

    let min = 0;
    let infiniteSearch = false;
    return props
      .recipesFetch(queryString, queryParams, min, infiniteSearch)
      .then(() => navigate(`/search/${queryString}${queryParams}`))
      .catch(err => logError(err));
  };

  const handleRedirect = url => navigate(url);

  //   const calsPS = (cals, servings) => Math.round(cals / servings);

  const handleRightClick = () => {
    subItemScrollerRef
      ? (subItemScrollerRef.scrollLeft += window.innerWidth)
      : null;
  };

  const handleLeftClick = () => {
    subItemScrollerRef
      ? (subItemScrollerRef.scrollLeft -= window.innerWidth)
      : null;
  };

  const handleSliderRightClick = () => {
    sliderScrollerRef ? (sliderScrollerRef.scrollLeft += slideWidth) : null;
  };

  const handleSliderLeftClick = () => {
    sliderScrollerRef ? (sliderScrollerRef.scrollLeft -= slideWidth) : null;
  };

  const isBottom = el =>
    el.getBoundingClientRect().bottom <= window.innerHeight + 1500;

  const trackScrolling = () => {
    document.removeEventListener('scroll', trackScrolling);
    const wrappedElement = document.getElementById('homeContainer');
    if (
      isBottom(wrappedElement) &&
      props.homepage &&
      props.homepage &&
      props.homepage.length < 96
    ) {
      let min = props.homepage.length.toString();
      if (
        localStorage.getItem(`random${min}`) &&
        JSON.parse(localStorage.getItem(`random${min}`))['timestamp'] >
          new Date().getTime()
      ) {
        props.homepageFetchRequest(
          JSON.parse(localStorage.getItem(`random${min}`))['content']
        );
        return document.addEventListener('scroll', trackScrolling);
      } else {
        return props
          .homepageFetch(min)
          .then(() => document.addEventListener('scroll', trackScrolling))
          .catch(err => logError(err));
      }
    }
    document.addEventListener('scroll', trackScrolling);
  };

  const sliderItems = [
    {
      header: 'Sensational Sangria Recipes',
      subHeader: 'Browse hundreds of variations on this fun and fruity punch.',
      image: image1,
      link: 'search?q=sangria&calories=0-10000',
    },
    {
      header: 'Hummus Recipes',
      subHeader: 'Browse hundreds of ways to get your dip on.',
      image: image2,
      link: 'search?q=hummus&calories=0-10000',
    },
    {
      header: 'Greek Pasta Salad',
      subHeader:
        'These salads are filled with bold flavors: kalamata olives, feta cheese and fresh herbs.',
      image: image3,
      link: 'search?q=greek%20pasta%20salad&calories=0-10000',
    },
    {
      header: 'Sloppy Bulgogi and other Fusion Mashups.',
      subHeader: 'Try these delicious cross-cultural combos.',
      image: image4,
      link: 'search?q=fusion&calories=0-10000',
    },
    {
      header: 'Chicken Teriyaki Skewers',
      subHeader: 'See how to make delicious Summery chicken teriyaki skewers.',
      image: image5,
      link: 'search?q=chicken%20teriyaki%20skewers&calories=0-10000',
    },
  ];

  const subItems = [
    {
      title: 'World Cuisine',
      image: image6,
      link: 'search?q=world%20cuisine&calories=0-10000',
    },
    {
      title: 'Vegan Recipes',
      image: image7,
      link: 'search?q=vegan&calories=0-10000',
    },
    {
      title: 'Slow Cooker',
      image: image8,
      link: 'search?q=slow%20cooker&calories=0-10000',
    },
    {
      title: 'Shrimp Recipes',
      image: image9,
      link: 'search?q=shrimp&calories=0-10000',
    },
    {
      title: 'Cookies',
      image: image10,
      link: 'search?q=cookie&calories=0-10000',
    },
    {
      title: 'Chicken Recipes',
      image: image11,
      link: 'search?q=chicken&calories=0-10000',
    },
    {
      title: 'Cake Recipes',
      image: image12,
      link: 'search?q=cake&calories=0-10000',
    },
    {
      title: 'Breakfast',
      image: image13,
      link: 'search?q=breakfast&calories=0-10000',
    },
    {
      title: 'Bread Recipes',
      image: image14,
      link: 'search?q=bread&calories=0-10000',
    },
    {
      title: 'Appetizers',
      image: image15,
      link: 'search?q=appetizers&calories=0-10000',
    },
  ];
  return (
    <div className="main">
      <section id="homeContainer" className="container">
        <div className="sliderContainer">
          <div className="slider" ref={sliderScrollerRef}>
            {sliderItems.map((item, idx) => {
              let boundItemClick = handleBoundItemClick.bind(this, item);
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
                  <img
                    src={item.image}
                    className="sliderItemImage"
                    alt={item.header}
                  />
                </div>
              );
            })}
          </div>
          <div
            className="sliderIconChevronLeft sliderIcon"
            onClick={handleSliderLeftClick}
            title="Scroll right"
          ></div>
          <div
            className="sliderIconChevronRight sliderIcon"
            onClick={handleSliderRightClick}
            title="Scroll left"
          ></div>
        </div>
        <div className="sliderSubItemWrapper">
          <div className="sliderSubItem" ref={subItemScrollerRef}>
            <div className="subItemInnerWrapper">
              {subItems.map((subItem, idx) => {
                let boundSubitemClick = handleBoundSubitemClick.bind(
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
                        alt={subItem.title}
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
            onClick={handleLeftClick}
            title="Scroll left"
          ></div>
          <div
            className="iconChevronRight subItemIcon"
            onClick={handleRightClick}
            title="Scroll right"
          ></div>
        </div>
        <RecipesMap
          recipes={props.homepage}
          containerClass={'homepageRecipesOuter'}
          redirect={handleRedirect}
        />
        <div>
          {renderIf(
            props.homepage && props.homepage.length >= 96,
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

const mapStateToProps = state => ({
  homepage: state.homepage,
  log: state.log,
});

const mapDispatchToProps = dispatch => ({
  favoritesFetch: favoritesArr => dispatch(favoritesFetchRequest(favoritesArr)),
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
});

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);
