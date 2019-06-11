import React from "react";
import TopBar from "./TopBar";
import DevelopmentPlan from "../../containers/DevelopmentPlan";

const DevPlanPage = props => {
  return (
    <div className="embedded-dev-plan">
      <h3 style={{ textAlign: "center" ,fontSize:"18px"}}>
        EMPLOYEE PERFORMANCE REVIEW
      </h3>
      <TopBar {...props} />
      <div className="dev-plan-body">
        <DevelopmentPlan personId={props.personAssessed.id} />
      </div>
    </div>
  );
};

export default DevPlanPage;
