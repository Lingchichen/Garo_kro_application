import React from "react";
import { Link } from "react-router-dom";
import DevelopmentPlan from "../../containers/DevelopmentPlan";
import TopBar from "./TopBar";

const NeedsBox = props => (
  <div className="needs-box">
    <div className="label">{props.label}</div>
    {props.errors.map(error => (
      <div className="error-msg">{error}</div>
    ))}
    <textarea
      value={props.value}
      onChange={props.onChange}
      onBlur={props.updateReview}
      className={props.errors.length ? "error" : ""}
    />
  </div>
);

const ReviewPage = props => (
  <div className="review-page">
    <h3 style={{ textAlign: "center" }}>EMPLOYEE DEVELOPMENT PLAN REVIEW
      <Link to="/development" className="exit">&times;</Link>
    </h3>
    <TopBar {...props} />
    {props.jobSpecific && (
      <NeedsBox
        label="Job-Specific Development Needs:"
        value={props.job_specific_dev_needs}
        onChange={props.jobSpecificNeedsChanged}
        updateReview={props.updateReview}
        errors={props.job_specific_dev_needs_errors}
      />
    )}
    {!props.jobSpecific && (
      <NeedsBox
        label="Future Opportunities Development Needs:"
        value={props.future_opportunities}
        onChange={props.futureOpportunitiesNeedsChanged}
        updateReview={props.updateReview}
        errors={props.future_opportunities_errors}
      />
    )}
    <DevelopmentPlan personId={props.personAssessed.id} reviewType={'DEVELOPMENT'} reviewId={props.reviewId} />
  </div>
);

export default ReviewPage;
