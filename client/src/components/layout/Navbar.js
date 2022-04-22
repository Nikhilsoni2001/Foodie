import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const isAuhenticated = false;

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
        <Link to="/logout">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span className="hide-sm"> Logout</span>
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar">
      <h1>
        <Link to="/">
          <i class="fa-solid fa-utensils"></i> Foodie
        </Link>
      </h1>

      {isAuhenticated ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar;
