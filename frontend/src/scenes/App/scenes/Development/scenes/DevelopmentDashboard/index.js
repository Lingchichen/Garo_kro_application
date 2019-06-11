import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import "./style.css";
import DevpDashboardPage from "./DevpDashboardPage";

class DevelopmentDashboard extends Component{
  render() {
    return (
      <div className="performance-reviews">
          <DevpDashboardPage
          {...this.state}
          {...this.props}

          performanceReviewClicked={this.performanceReviewClicked}
          />
      </div>
    );
  }
}
  const mapStateToProps = (state, ownProps) => {
    let props = {
      personId: 0,
      actionSteps: [],
      stepStatus:'',
      historyReviews:[],
      assessedId:0,
      mapOfScuccess:[],
      teamMember:[],
      team:[],
      successList:[],
      teamId:0,
      temp:[],
      personLogin:[],
      jobDescription:'',
      picture:'',
      StrengthAssessmentReviewClicked:[],
      strengthAssessmentReviews:[],
      assessmentRequest:0
    };


    props.picture=state.me.picture_file
    let personLogin = state.me;
    let personId =state.me.id;
    props.personLogin=personLogin;
    props.personId = personId;

    let jobDescription = state.jobDescriptions.items.find(
      ({ id }) => id === personLogin.job_description
    );
    if (!jobDescription) return props;
    props.jobDescription = jobDescription;

    let person = state.people.items.find(({ id }) => id === personId);

    if (!person) return props;

    let actionSteps = state.employeeDevelopmentPlanActionSteps.items.filter(
      ({ person }) => person === personId
    );
    if (!actionSteps.length) return props;

    actionSteps = actionSteps.map(actionStep =>
      Object.assign({}, actionStep, {
        stepStatus: state.projectMilestoneDevelopmentStepStatuses.items
          .filter(s => s.development_plan_step === actionStep.id)
          .sort((a, b) => moment(b.date).diff(a.date))
          .shift()
      })
    );

    actionSteps = actionSteps.map(actionStep =>
      Object.assign({}, actionStep, {
        stepStatus: Object.assign({}, actionStep.stepStatus, {
          status: state.statuses.items.find(({ id }) => {
            if (actionStep.stepStatus) return id === actionStep.stepStatus.status;
            else return false;
          })
        })
      })
    );

    actionSteps = actionSteps.filter(
      actionStep => actionStep.stepStatus.status.title !=="CLOSED"
    )

    props.actionSteps = actionSteps;

    let isForPerson = personId => assessment => {
      let request = state.strengthAssessmentRequests.items.find(({ id }) => id === assessment.assessment_request)
      if(!request) return false;
      if(request.person_assessed === personId) return true;
      return false;
    };



    let historyReviews=state.strengthAssessments.items
                        .filter(({ assessed_by_person }) => assessed_by_person === personId)
                        .filter(isForPerson(personId))

    historyReviews=historyReviews.map(review =>
      Object.assign({},review,{
        reviewType:'Strength Assessment',
        reviewId:personId,
        reviewDate:review.assessment_date,
      }))

      /////Tyler code
    let strengthAssessmentReviews = state.strengthAssessmentReviews.items.filter(isForPerson(personId));
    let StrengthAssessmentReviewClicked=state.strengthAssessmentRequests.items.filter(({person_assessed})=> person_assessed === personId).sort((a, b) => moment(b.request_date).diff(a.request_date));
    let assessmentRequest=StrengthAssessmentReviewClicked.length
      ? StrengthAssessmentReviewClicked[0].id
      : 0
    props.assessmentRequest=assessmentRequest
    props.strengthAssessmentReviews=strengthAssessmentReviews;

    StrengthAssessmentReviewClicked=StrengthAssessmentReviewClicked.map(review =>
      Object.assign({},review,{
        requestDate:state.strengthAssessmentRequests.items.filter(isForPerson(personId)).sort((a, b) => moment(b.request_date).diff(a.request_date)).request_date
      }));

    props.StrengthAssessmentReviewClicked=StrengthAssessmentReviewClicked

    strengthAssessmentReviews = strengthAssessmentReviews.map(review =>
      Object.assign({},review,{
        reviewType:'Strength Assessment Review',
        reviewId:personId,
        reviewDate:review.review_date,
      })
    );


    let performanceReviews = state.performanceReviews.items.filter(({id})=> id === personId)
    performanceReviews=performanceReviews.map(review =>
      Object.assign({},review,{
        reviewType:'Performance Review',
        reviewId:personId,
        reviewDate:review.date_of_appraisal

      })
    );

    let employeeDevelopmentPlanReviews = state.employeeDevelopmentPlanReviews.items.filter(({id})=> id === personId)
    employeeDevelopmentPlanReviews=employeeDevelopmentPlanReviews.map(review =>
      Object.assign({},review,{
        reviewType:'Employee Development Plan',
        reviewId:personId,
        reviewDate:review.assessment_date.items

      })
    );
    historyReviews = historyReviews.concat(performanceReviews);
    historyReviews = historyReviews.concat(strengthAssessmentReviews);
    historyReviews = historyReviews.concat(employeeDevelopmentPlanReviews);
    historyReviews = historyReviews.sort((a, b) => moment(b.reviewDate).diff(a.reviewDate))
    props.historyReviews=historyReviews




    let teamMember = state.teamMembers.items.filter(({person})=>person===personId);

    let teamId=teamMember.map(t=>t.team)




    let team = state.teams.items.filter(({id})=>id=>{
      if (teamId.includes(id))

        return id
    });

    let successId=team.map(t=>t.id)
    let successList= state.successes.items.filter(({id})=> id=>{
      if (successId.includes(id))
        return id
    });

    props.successList=successList
    return props;
  };

export default connect(mapStateToProps)(DevelopmentDashboard);
