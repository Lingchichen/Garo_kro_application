import React from "react";
import Button from "components/Button";
import personIcon from "images/person.png";

const TopBar = props => {
  let name = "";
  let position = "";
  let picture_file = null;

  if (props.personAssessed) {
    let firstName = props.personAssessed.user.first_name;
    let lastName = props.personAssessed.user.last_name;
    picture_file = props.personAssessed.picture_file;
    name = `${firstName} ${lastName}`;
  }

  if (props.jobDescription) {
    position = props.jobDescription.job_title;
  }

  return (
    <div className="top-bar">
      <div className="person-assessed">
        {picture_file && (
          <img src={picture_file} alt="" />
        )}
        {!picture_file && (
          <img src={personIcon} alt="" />
        )}
        {name}<br />
        <span className="position">{position}</span>
      </div>
      <div className="buttons">
        <Button
          className={`small-btn${props.jobSpecific ? " active" : ""}`}
          click={props.jobSpecificClicked}
        >
          Job-Specific
        </Button>
        <Button
          className={`small-btn${props.jobSpecific ? "" : " active"}`}
          click={props.futureOpportunitiesClicked}
        >
          Future Opportunities
        </Button>
      </div>
      <div className="complete">
        <Button className="small-btn" click={props.completeClicked}>
          Complete<br />Review
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
