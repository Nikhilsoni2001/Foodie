import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import PropTypes from 'prop-types';
import { Link, Navigate } from 'react-router-dom';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Navigate replace to="/verify" />;
  }

  return (
    <Fragment>
      <div className="login">
        <div className="left-login">
          <h1 className="large">login</h1>
          <form
            className="form"
            onSubmit={(e) => {
              onSubmit(e);
            }}
          >
            <div className="form-group">
              <label htmlFor="email">Email: </label>
              <input
                type="email"
                id="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={(e) => {
                  onChange(e);
                }}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password: </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                name="password"
                value={password}
                minLength="6"
                onChange={(e) => {
                  onChange(e);
                }}
                required
              />
            </div>
            <div className="center">
              <input type="submit" value="Login" />
            </div>

            <div className="center">
              <Link to="/forget">
                <p>Forget password?</p>
              </Link>
            </div>
          </form>
        </div>
        <div className="right-login hide-sm"></div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};
export default connect(mapStateToProps, { login })(Login);
