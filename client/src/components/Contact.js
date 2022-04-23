import React, { useState } from 'react';
import contact from '../img/contact.png';
import emailjs from 'emailjs-com';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Contact = ({
  auth: {
    user: { name, email },
  },
}) => {
  const [message, setMessage] = useState('');

  const sendMail = (e) => {
    e.preventDefault();

    const contactParams = {
      name,
      email,
      message,
    };

    emailjs
      .send(
        'service_9e6f0d8',
        'template_jfav33x',
        contactParams,
        '-pHR-QuvLhe1HfRpc'
      )
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.error(err));
    e.target.reset();
    setMessage('');
  };

  return (
    <div className="contact container">
      <div className="left-contact hide-sm">
        <img src={contact} alt="Contact us" />
      </div>
      <div className="right-contact">
        <h1 className="large contact-head">Contact us</h1>
        <p className="lead">Feel free to reach out!</p>
        <form className="form" onSubmit={(e) => sendMail(e)}>
          <div className="form-group">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              placeholder="Enter your Name"
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              placeholder="Enter your Email"
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message: </label>
            <textarea
              cols={25}
              rows={5}
              type="text"
              name="message"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
            />
          </div>
          <div className="form-group">
            <div className="center">
              <input type="submit" value="Send" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

Contact.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Contact);
