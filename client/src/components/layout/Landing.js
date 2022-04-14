import React from 'react';
import landing from '../../img/landing.jpg';

const Landing = () => {
  return (
    <section>
      <div className="landing">
        <div className="left-landing">
          <h1 className="large my-1">Food is love.</h1>
          <h1 className="large my-1">Love is food.</h1>
          <h1 className="large my-1">It’s all good.</h1>
          <p className="lead my-1">へ(｡•ิ‿ -〃)</p>
        </div>

        <div className="right-landing">
          <img src={landing} alt="" />
        </div>
      </div>
    </section>
  );
};

export default Landing;
