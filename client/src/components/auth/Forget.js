import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { forgetPassword } from '../../actions/auth';

const Forget = ({ forgetPassword }) => {
  const [email, setEmail] = useState('');

  const sendMail = (e) => {
    e.preventDefault();
    forgetPassword(email);
    setEmail('');
  };

  return (
    <div className="forget">
      <form className="form" onSubmit={(e) => sendMail(e)}>
        <div className="form-group">
          <h1 className="large py-2">Forget Password?</h1>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div className="center">
            <input type="submit" value="Send" />
          </div>
        </div>
      </form>
    </div>
  );
};

Forget.propTypes = {
  forgetPassword: PropTypes.func.isRequired,
};

export default connect(null, { forgetPassword })(Forget);
