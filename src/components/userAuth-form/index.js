import React from 'react';
import superagent from 'superagent';
import { isEmail, isAlphanumeric, isAscii } from 'validator';

import Tooltip from '../helpers/tooltip';
import { classToggler, renderIf } from '../../lib/util';

class UserAuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      emailError: null,
      usernameError: null,
      usernameAvailable: true,
      passwordError: null,
      error: null,
      focused: null,
      submitted: false,
    };
  }
  componentWillUnmount() {
    this.setState({ username: '', email: '', password: '' });
  }
  validateInput = e => {
    let { name, value } = e.target;

    let errors = {
      emailError: this.state.emailError,
      passwordError: this.state.passwordError,
      usernameError: this.state.usernameError,
    };

    let setError = (name, error) => (errors[`${name}Error`] = error);
    let deleteError = name => (errors[`${name}Error`] = null);

    if (name === 'email') {
      if (!value) {
        setError(name, `${name} can not be empty`);
      } else if (!isEmail(value)) {
        setError(name, `${value} is not a valid email`);
      } else {
        deleteError(name);
      }
    }

    if (name === 'username') {
      if (!value) {
        setError(name, `${name} can not be empty`);
      } else if (!isAlphanumeric(value)) {
        setError(name, 'username can only contain letters and numbers');
      } else {
        deleteError(name);
      }
    }

    if (name === 'password') {
      if (!value) {
        setError(name, `${name} can not be empty`);
      } else if (!isAscii(value)) {
        setError(name, 'password may only contain normal charachters');
      } else {
        deleteError(name);
      }
    }

    this.setState({
      ...errors,
      error: !!(
        errors.emailError ||
        errors.usernameError ||
        errors.passwordError
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
    this.validateInput({ ...e });

    this.setState({
      [name]: value,
    });

    if (this.props.authFormAction === 'Sign Up' && name === 'username') {
      this.usernameCheckAvailable(value);
    }
  };
  usernameCheckAvailable = username => {
    return superagent
      .get(`${process.env.API_URL}/api/signup/usernames/${username}`)
      .then(() => this.setState({ usernameAvailable: true }))
      .catch(() => this.setState({ usernameAvailable: false }));
  };
  handleSubmit = e => {
    e.preventDefault();
    if (!this.state.error) {
      this.props.onComplete(this.state, this.handleError).catch(err => {
        this.setState({
          error: err,
          submitted: true,
        });
      });
    }
    this.setState(state => ({
      submitted: true,
      usernameError: state.usernameError || state.username ? null : 'required',
      emailError:
        state.emailError || !isEmail(state.email)
          ? `${state.email} is not a valid email`
          : null,
      passwordError: state.passwordError || state.password ? null : 'required',
    }));
  };
  handleError = err => {
    const usernameError =
      err.status === 401
        ? 'username or password incorrect'
        : 'username or email already taken';
    this.setState({
      usernameError,
    });
  };
  render() {
    let {
      focused,
      submitted,
      username,
      emailError,
      passwordError,
      usernameError,
      usernameAvailable,
    } = this.state;
    let passwordAutocompleteValue =
      this.props.authFormAction === 'Sign Up'
        ? 'new-password'
        : 'current-password';
    return (
      <form
        onSubmit={this.handleSubmit}
        className={classToggler({
          error: this.state.error && this.state.submitted,
        })}
      >
        {renderIf(
          this.props.authFormAction === 'Sign Up',
          <div>
            <h2>sign up.</h2>
            <div className="authInputWrapper">
              <div className="authInner">
                <div className="authinside">
                  <input
                    className={classToggler({ error: emailError })}
                    type="text"
                    name="email"
                    placeholder="Email Address"
                    value={this.state.email}
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    autoComplete="email"
                  />
                </div>
              </div>
            </div>
            <Tooltip
              message={emailError}
              show={focused === 'email' || submitted}
            />
          </div>
        )}
        {renderIf(
          this.props.authFormAction !== 'Sign Up',
          <div>
            <h2>sign in.</h2>
          </div>
        )}
        <div className="authInputWrapper">
          <div className="authInner">
            <div className="authinside">
              <input
                className={classToggler({
                  error: usernameError || !usernameAvailable,
                })}
                type="text"
                name="username"
                placeholder="Username"
                value={this.state.username}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                autoComplete="username"
              />
            </div>
          </div>
        </div>
        <Tooltip
          message={usernameError}
          show={focused === 'username' || submitted}
        />
        {renderIf(
          username && this.props.authFormAction === 'Sign Up',
          <div>
            <p className="authPadding">
              {username}{' '}
              {usernameAvailable ? 'is available' : 'is not available'}
            </p>
          </div>
        )}
        <div className="authInputWrapper">
          <div className="authInner">
            <div className="authinside">
              <input
                className={classToggler({ passwordError })}
                type="password"
                name="password"
                placeholder="Password (case sensitive)"
                value={this.state.password}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                autoComplete={passwordAutocompleteValue}
              />
            </div>
          </div>
        </div>
        <Tooltip
          message={passwordError}
          show={focused === 'password' || submitted}
        />
        <button type="submit"> {this.props.authFormAction} </button>
      </form>
    );
  }
}

export default UserAuthForm;
