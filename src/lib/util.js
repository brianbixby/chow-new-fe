export const log = (...args) => console.log(...args);
export const logError = (...args) => console.error(...args);
export const renderIf = (test, component) => (test ? component : undefined);
export const classToggler = options =>
  Object.keys(options)
    .filter(key => !!options[key])
    .join(' ');

export const checkAndAdd = (payload, state) => {
  var found = state.some(function (el) {
    return el._id === payload._id;
  });
  if (!found) {
    state.push(payload);
  }
  return state;
};

export const formatDate = date => {
  let dateArr = new Date(date).toDateString().split(' ');
  return `${dateArr[1]} ${dateArr[2]}, ${dateArr[3]}`;
};

export const userValidation = async (props, navigate, redirect = false) => {
  try {
    if (!props.userAuth) {
      const token = localStorage.getItem('chowToken');
      if (token) {
        await props.tokenSignIn(token);
        const profile = await props.userProfileFetch();
        await props.favoritesFetch(profile.body);
        return;
      } else {
        if (redirect) {
          navigate('/');
        }
      }
    } else {
      return;
    }
  } catch (err) {
    localStorage.removeItem('chowToken');
    logError(err);
    return redirect ? navigate('/') : true;
  }
};
