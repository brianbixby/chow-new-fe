import superagent from 'superagent';

export const recipesFetch = recipes => ({
  type: 'RECIPES_FETCH',
  payload: recipes,
});

export const infiniteRecipesFetch = recipes => ({
  type: 'INFINITE_RECIPES_FETCH',
  payload: recipes,
});

export const homepageFetch = recipes => ({
  type: 'HOMEPAGE_FETCH',
  payload: recipes,
});

export const recipeFetch = recipe => ({
  type: 'RECIPE_FETCH',
  payload: recipe,
});

export const recipesFetchRequest =
  (queryString, queryParams, min, infiniteSearch) => dispatch => {
    const max = (parseInt(min) + 24).toString();
    let url =
      min === 0 || min === 49
        ? `https://api.edamam.com/${queryString}${process.env.REACT_APP_API_KEY}&from=${min}&to=${max}${queryParams}`
        : `https://api.edamam.com/${queryString}${process.env.REACT_APP_API_KEY2}&from=${min}&to=${max}${queryParams}`;

    return superagent.get(url).then(res => {
      localStorage.setItem(
        queryString + queryParams + min,
        JSON.stringify({
          content: res.body,
          timestamp: new Date().getTime() + 604800000,
        })
      );
      !infiniteSearch
        ? dispatch(recipesFetch(res.body))
        : dispatch(infiniteRecipesFetch(res.body));
      return res.body;
    });
  };

export const homepageFetchRequest = min => dispatch => {
  const max = (parseInt(min) + 24).toString();
  let url = `https://api.edamam.com/search?q=summer${process.env.REACT_APP_API_KEY3}&from=${min}&to=${max}&calories=0-10000`;

  return superagent.get(url).then(res => {
    localStorage.setItem(
      `random${min}`,
      JSON.stringify({
        content: res.body.hits,
        timestamp: new Date().getTime() + 604800000,
      })
    );
    dispatch(homepageFetch(res.body.hits));
    return res.body.hits;
  });
};

export const recipeFetchRequest = recipeURI => dispatch => {
  let qString = `r=http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_${recipeURI}`;
  let url = `https://api.edamam.com/search?${qString}${process.env.REACT_APP_API_KEY4}`;

  return superagent.get(url).then(res => {
    if (!res.body.length) return null;
    dispatch(recipeFetch(res.body[0]));
    return res.body[0];
  });
};
