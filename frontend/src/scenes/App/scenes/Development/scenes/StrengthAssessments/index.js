import React from "react";
import { Route, Switch } from "react-router-dom";
import StrengthAssessment from "./scenes/StrengthAssessment";
import StrengthAssessmentReview from "./scenes/StrengthAssessmentReview";

const StrengthAssessments = () => (
  <div className="strength-assessments">
    <Switch>
      <Route
        path={`/development/strength-assessments/review/:assessmentRequestId`}
        component={StrengthAssessmentReview}
      />
      <Route
        path={`/development/strength-assessments/:assessmentRequestId`}
        component={StrengthAssessment}
      />
    </Switch>
  </div>
);

export default StrengthAssessments;
