import React from "react";
import { Link } from "react-router-dom";
import Button from "components/Button";
import backArrow from "images/ArrowB.png";
import projectIcon from "images/projectG.png";
import milestoneIcon from "images/milestoneG.png";
import "./style.css";

const TopGreyBar = props => {
  return (
    <div className="top-gray-bar">
      <div className="back">
        <img
          src={backArrow}
          alt=""
          onClick={() => {
            if (props.meetingId)
              props.history.push(`/meetings/${props.meetingId}`);
            else props.history.goBack();
          }}
        />
      </div>
      <div className="buttons">
        <Link to={`/projects/${props.projectId}`}>
          <Button className={props.project ? "active" : ""}>
            <img src={projectIcon} alt="" /> Project
          </Button>
        </Link>
        {props.showMilestones && (
          <Link to={`/projects/${props.projectId}/milestones`}>
            <Button className={props.milestonesActive ? "active" : ""}>
              <img src={milestoneIcon} alt="" /> Milestones ({props.milestones})
            </Button>
          </Link>
        )}
        {props.showNewMilestone && (
          <Link to={`/projects/${props.projectId}/milestones/new`}>
            <Button className="new-milestone-button">
              New<br />Milestone
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopGreyBar;
