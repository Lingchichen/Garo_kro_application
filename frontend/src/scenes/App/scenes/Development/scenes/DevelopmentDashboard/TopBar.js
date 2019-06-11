import React from "react";
import Button from "components/Button";
import personIcon from "images/person.png";

const TopBar = props => {
  let name = "";
  let position = "";

  if (props.personLogin) {
    let firstName = props.personLogin.user.first_name;
    let lastName = props.personLogin.user.last_name;
    name = `${firstName} ${lastName}`;
  }

  if (props.jobDescription) {
    position = props.jobDescription.job_title;
  }
  return(
    <div className="top-bar">
      <div className="person-assessed">
      {props.picture?
        (<img src={props.picture} alt=""/>
          ):(<img src={personIcon} alt="" />
        )
      }{name}<br />
        <span className="position" style={{textAlign:'center'}}>{position}</span>
        <br></br>
        <Button className={`small-btn${props.JobDesPage ? " active" : ""}`} click={props.performanceReviewClicked}>job Description</Button>
      </div>
    </div>
    );}

export default TopBar;
