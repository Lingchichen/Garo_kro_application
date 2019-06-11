import React from "react";
import Button from "components/Button";
import personIcon from "images/person.png";

const TopBar = props => {
  let name = "";
  let position = "";

  if (props.personAssessed) {
    let firstName = props.personAssessed.user.first_name;
    let lastName = props.personAssessed.user.last_name;
    name = `${firstName} ${lastName}`;
  }

  if (props.jobDescription) {
    position = props.jobDescription.job_title;
  }

  return (
    <div className="top-bar">
      <div className="person-assessed">

        {props.personAssessed.picture_file?(<img src={props.personAssessed.picture_file} alt="" />):(<img src={personIcon} alt="" />)} {name}
        <br />
        <span className="position">{position}</span>
      </div>
      <div className="buttons">
        <Button
          className={`small-btn${props.reviewPage ? " active" : ""}`}
          click={props.performanceReviewClicked}
        >
          Performance Review
        </Button>
        <Button
          className={`small-btn${props.devPlanPage ? " active" : ""}`}
          click={props.devPlanClicked}
        >
          Development Plan
        </Button>
      </div>
      <div className="button_1">
        <Button
          className={`small-btn${props.thankPage ? " active" : ""}`}
          click={props.completeClicked}
        >
          Complete<br /> Review
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
