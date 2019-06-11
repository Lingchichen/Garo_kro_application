import React from "react";
import { Link } from "react-router-dom";
import TopBar from "./TopBar";
import DevelopmentPlan from "../../../../containers/DevelopmentPlan";

const EmbeddedDevPlan = props => (
  <div className="embedded-dev-plan">
    <h3 style={{ textAlign: "center" }}>EMPLOYEE STRENGTH ASSESSMENT REVIEW
      <Link to="/development" className="exit">&times;</Link>
    </h3>
    <TopBar {...props} />
    <div className="dev-plan-body">
      <DevelopmentPlan personId={props.personAssessed.id} reviewId={props.reviewId} reviewType={'STRENGTH'} />
    </div>
  </div>
);

export default EmbeddedDevPlan;
