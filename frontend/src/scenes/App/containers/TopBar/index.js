import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { PERFORMANCE, STRENGTH, DEVELOPMENT } from "ducks/DevelopmentReviewInProgress";
import asOneLogo from "images/working-as-one.png";
import gears from "images/gearsB.png";
import socialMedia from "images/socialmedia.png";
import poweredByKro from "images/powered-by-kro.png";
import meeting from "images/meetingB.png";
import "./style.css";

const TopBar = props => {
  let logoURL = "";
  let company = null;
  let reviewInProgress = false;
  let reviewRoute = "";

  if (props.me.user.is_staff && props.defaultCompany) {
    company = props.companies.find(({ id }) => id === props.defaultCompany);
    if (company) logoURL = company.logo_file;
  } else {
    company = props.companies.find(({ id }) => id === props.me.company);
    if (company) logoURL = company.logo_file;
  }

  if (props.reviewInProgress && props.reviewInProgress.reviewInProgress) {
    reviewInProgress = true;
    let personReviewedId = 0;
    let reviewId = props.reviewInProgress.reviewId;
    switch (props.reviewInProgress.reviewType) {
      case STRENGTH:
        let requestId = props.reviewInProgress.other.requestId;
        reviewRoute = `/development/strength-assessments/review/${requestId}?progresscheck=false&reviewId=${reviewId}`;
        break;
      case PERFORMANCE:
        personReviewedId = props.reviewInProgress.other.personReviewedId;
        reviewRoute = `/development/performance-reviews/${personReviewedId}?progresscheck=false&reviewId=${reviewId}`;
        break;
      case DEVELOPMENT:
        personReviewedId = props.reviewInProgress.other.personReviewedId;
        reviewRoute = `/development/development-plan-review/${personReviewedId}?progresscheck=false&reviewId=${reviewId}`;
        break;
      default:
        reviewRoute = "/development";
        break;
    }
  }

  return (
    <div className="top-bar">
      <div className="left">
        <img src={asOneLogo} alt="" />
        <img src={logoURL} alt="" />
        {props.meetingInProgress && (
          <Link to={`/meetings/${props.timer.meeting_id}`}>
            <img src={meeting} alt="" />
            <span className="in-progress">In Progress</span>
          </Link>
        )}
        {reviewInProgress && (
          <Link to={reviewRoute}>
            <img src={meeting} alt="" />
            <span className="in-progress">In Progress</span>
          </Link>
        )}
      </div>
      <div className="right">
        <img className="powered-by-kro" src={poweredByKro} alt="" />
        <img className="social-media" src={socialMedia} alt="" />
        <img className="gears" src={gears} alt="" />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  meetingInProgress: state.meetingTimer.running,
  me: state.me,
  defaultCompany: state.defaultCompany || state.me.company,
  companies: state.companies.items,
  timer: state.meetingTimer,
  reviewInProgress: state.reviewInProgress
});

export default connect(mapStateToProps)(TopBar);
