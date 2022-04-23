import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ logout, auth: { isAuthenticated, loading } }) => {
  const guestLinks = (
    <ul>
      <li>
        <Link to="/">
          <span> Home</span>
        </Link>
      </li>
      <li>
        <Link to="/about">
          <span> About</span>
        </Link>
      </li>
      <li>
        <Link to="/signup">
          <span> Signup</span>
        </Link>
      </li>
      <li>
        <Link to="/login">
          <span> Login</span>
        </Link>
      </li>
    </ul>
  );

  const authLinks = (
    <ul>
      <li>
        <Link to="/">
          <span> Home</span>
        </Link>
      </li>
      <li>
        <Link to="/about">
          <span> About</span>
        </Link>
      </li>
      <li>
        <Link to="/menu">
          <span> Menu</span>
        </Link>
      </li>
      <li>
        <Link to="/contact">
          <span> Contact</span>
        </Link>
      </li>
      <li>
        <Link to="/login" onClick={logout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <span className="hide-sm"> Logout</span>
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar">
      <h1>
        <Link to="/">
          <i className="fa-solid fa-utensils"></i> Foodie
        </Link>
      </h1>

      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { logout })(Navbar);
