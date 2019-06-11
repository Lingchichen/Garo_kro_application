import React from "react";
import { Route, Switch } from "react-router-dom";
import StrengthAssessments from "./scenes/StrengthAssessments";
import PerformanceReviews from "./scenes/PerformanceReviews";
import DevelopmentDashboard from "./scenes/DevelopmentDashboard";
import DevelopmentPlanReview from "./scenes/DevelopmentPlanReview";

const Development = props => (
  <div className="development">
    <Switch>
      <Route exact path={`/development`} component={DevelopmentDashboard} />
      <Route
        path={`/development/strength-assessments`}
        component={StrengthAssessments}
      />
      <Route
        path={`/development/performance-reviews/:performanceRequestId`}
        component={PerformanceReviews}
      />
      <Route
        path={`/development/development-plan-review/:personId`}
        component={DevelopmentPlanReview}
      />
    </Switch>
  </div>
);

export default Development;
