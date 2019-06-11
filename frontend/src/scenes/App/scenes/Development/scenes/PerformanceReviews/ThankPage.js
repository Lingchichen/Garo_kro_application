import React from "react";
import { Link } from "react-router-dom";

const ThankPage = props => {
  return (
    <div className="question">
      <h3 >
        Thanks for your review
        <br></br>
        click <Link to="/">here</Link> to go back homepage
      </h3>
    </div>
  )
};

export default ThankPage;
