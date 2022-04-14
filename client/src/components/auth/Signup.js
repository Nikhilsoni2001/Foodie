import React, { Fragment, useState } from 'react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password2: '',
  });

  const { name, email, phone, password, password2 } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      //   setAlert('Passwords do not match', 'danger');
    } else {
      //   register({ name, email, password });
    }
  };

  return (
    <Fragment>
      <div className="signup">
        <div className="left-signup hide-sm"></div>
        <div className="right-signup">
          <h1 className="large">Signup</h1>
          <form className="form" onSubmit={(e) => onSubmit(e)}>
            <div className="form-group">
              <label htmlFor="name">Name: </label>
              <input
                type="text"
                id="name"
                placeholder="Name"
                name="name"
                required
                value={name}
                onChange={(e) => {
                  onChange(e);
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email: </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => {
                  onChange(e);
                }}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone: </label>
              <input
                type="tel"
                id="phone"
                placeholder="Phone Number"
                name="phone"
                maxLength="10"
                pattern="[0-9]{10}"
                value={phone}
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
                minLength="6"
                value={password}
                onChange={(e) => {
                  onChange(e);
                }}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmpassword">Confirm Password: </label>
              <input
                type="password"
                id="confirmpassword"
                placeholder="Confirm Password"
                name="password2"
                minLength="6"
                value={password2}
                onChange={(e) => {
                  onChange(e);
                }}
                required
              />
            </div>

            <div className="center">
              <input type="submit" value="Register" />
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Signup;
