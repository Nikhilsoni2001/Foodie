import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { verifyEmail } from '../../actions/auth';
import { Navigate } from 'react-router-dom';

const Verify = ({
  verifyEmail,
  auth: {
    loading,
    isAuthenticated,
    user: { verify },
  },
}) => {
  const [code, setCode] = useState('');

  const onChange = (e) => {
    setCode(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('Submit');
    verifyEmail(code);
  };

  if (!loading && isAuthenticated && verify) {
    return <Navigate replace to="/" />;
  }

  return (
    <section>
      <div className="container verify">
        <h1 className="large verify-head">
          Email Verification <i class="fa-solid fa-circle-check"></i>
        </h1>

        <p className="lead">
          <i class="fa-solid fa-envelope"></i> Enter the 6-digit code we sent to
          your email address to verify the account
        </p>

        <form
          className="form"
          onSubmit={(e) => {
            onSubmit(e);
          }}
        >
          <div className="form-group">
            <label htmlFor="code">Code</label>
            <input
              type="text"
              name="code"
              id="code"
              value={code}
              onChange={(e) => {
                onChange(e);
              }}
              placeholder="Enter your Code"
            />
          </div>
          <div className="form-group">
            <div className="center">
              <input type="submit" value="Send" />
            </div>
          </div>

          <div className="form-group">
            <div className="center">
              <button>Resend Code</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

Verify.propTypes = {
  verifyEmail: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { verifyEmail })(Verify);
