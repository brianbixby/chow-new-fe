import React from 'react';

class UserProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.userProfile
      ? { ...props.userProfile }
      : {
          state: '',
          country: '',
          image: '',
        };
  }

  componentDidUpdate(prevProps) {
    if (this.props.userProfile !== prevProps.userProfile) {
      this.setState(this.props.userProfile);
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    return this.props.onComplete(this.state);
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    return (
      <section className="profile-form">
        <form className="form" onSubmit={this.handleSubmit}>
          <h2 className="title">{this.props.profileAction}</h2>
          <label htmlFor="state" className="profileFormLabel">
            State:{' '}
          </label>
          <input
            type="text"
            placeholder="State"
            value={this.state.state || ''}
            name="state"
            onChange={this.handleChange}
            autoComplete="address-level1"
          />
          <label htmlFor="country" className="profileFormLabel">
            Country:{' '}
          </label>
          <input
            type="text"
            placeholder="Country"
            value={this.state.country || ''}
            name="country"
            onChange={this.handleChange}
            autoComplete="country"
          />
          <label htmlFor="image" className="profileFormLabel">
            Profile img URL:{' '}
          </label>
          <input
            type="text"
            placeholder="img url"
            value={this.state.image || ''}
            name="image"
            onChange={this.handleChange}
            autoComplete="photo"
          />
          <p className="textRight">
            <button className="red-button b-button" type="submit">
              Update
            </button>
          </p>
        </form>
      </section>
    );
  }
}

export default UserProfileForm;
