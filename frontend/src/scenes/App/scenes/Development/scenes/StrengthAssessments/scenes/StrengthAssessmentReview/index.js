import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import querystring from "query-string";
import {
  createReview,
  updateReview,
  deleteReview
} from "ducks/StrengthAssessmentReviews";
import { STRENGTH, startReview, stopReview } from "ducks/DevelopmentReviewInProgress";
import LandingPage from "./LandingPage";
import Question from "./Question";
import CommentsPage from "./CommentsPage";
import EmbeddedDevPlan from "./EmbeddedDevPlan";
import ProgressCheck from "../../../../containers/ProgressCheck";
import "./style.css";
import Api from "../../../../../../../../Api";

class StrengthAssessmentReview extends Component {
  constructor(props) {
    super(props);
    this.begin = this.begin.bind(this);
    this.reviewClicked = this.reviewClicked.bind(this);
    this.devPlanClicked = this.devPlanClicked.bind(this);
    this.commentsClicked = this.commentsClicked.bind(this);
    this.previousQuestion = this.previousQuestion.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.complete = this.complete.bind(this);
    this.reviewerCommentsChanged = this.reviewerCommentsChanged.bind(this);
    this.employeeCommentsChanged = this.employeeCommentsChanged.bind(this);
    this.reviewCreated = this.reviewCreated.bind(this);
    this.managerUsernameChanged = this.managerUsernameChanged.bind(this);
    this.managerPasswordChanged = this.managerPasswordChanged.bind(this);
    this.managerLogin = this.managerLogin.bind(this);
    this.buildReview = this.buildReview.bind(this);
    this.reviewCompleted = this.reviewCompleted.bind(this);
    this.updateReview = this.updateReview.bind(this);
    this.handleCompletionError = this.handleCompletionError.bind(this);
    this.resume = this.resume.bind(this);
    this.discard = this.discard.bind(this);
    this.initialState = this.initialState.bind(this);

    this.state = this.initialState();

    this.state.progressCheck = props.progressCheck;

    if (props.review) {
      this.state.reviewId = props.review.id;
      this.state.reviewerComments = props.review.reviewers_comments;
      this.state.employeeComments = props.review.employee_comments;
      this.state.completed = props.review.completed;

      if (props.reviewInProgress && props.reviewInProgress.reviewInProgress) {
        this.state.managerToken = props.reviewInProgress.managerToken;
        this.state.landingPage = props.reviewInProgress.other.landingPage;
        this.state.questionPage = props.reviewInProgress.other.questionPage;
        this.state.commentsPage = props.reviewInProgress.other.commentsPage;
        this.state.developmentPlan = props.reviewInProgress.other.developmentPlan;
        this.state.thankYouPage = props.reviewInProgress.other.thankYouPage;
        this.state.currentQuestion = props.reviewInProgress.other.currentQuestion;

        this.state.manager = props.people.find(
          ({ id }) => id === props.reviewInProgress.managerId
        );

        this.state.managerJobDescription = props.jobDescriptions.find(
          ({ id }) => id === this.state.manager.job_description
        );
      }
    }
  }

  buildReview() {
    return {
      id: this.state.reviewId,
      assessment_request: this.props.assessmentRequest.id,
      assessed_by_person: this.state.manager.id || 0,
      reviewers_comments: this.state.reviewerComments,
      employee_comments: this.state.employeeComments,
      manager_token: this.state.managerToken
    };
  }

  begin() {
    let review = this.buildReview();
    this.props.createReview(this.props.token, review, this.reviewCreated);
  }

  reviewClicked() {
    this.setState({
      questionPage: true,
      developmentPlan: false,
      commentsPage: false
    });
  }

  devPlanClicked() {
    this.setState({
      questionPage: false,
      developmentPlan: true,
      commentsPage: false
    });
  }

  commentsClicked() {
    this.setState({
      questionPage: false,
      developmentPlan: false,
      commentsPage: true
    });
  }

  previousQuestion() {
    if (this.state.currentQuestion !== 0)
      this.setState({ currentQuestion: this.state.currentQuestion - 1 });
  }

  nextQuestion() {
    if (this.state.currentQuestion !== this.state.questions.length - 1)
      this.setState({ currentQuestion: this.state.currentQuestion + 1 });
  }

  reviewerCommentsChanged(newComments) {
    this.setState({ reviewerComments: newComments });
  }

  employeeCommentsChanged(newComments) {
    this.setState({ employeeComments: newComments });
  }

  componentWillUnmount() {
    if (this.state.reviewId && !this.state.progressCheck){
      this.updateReview();
    }
  }

  updateReview() {
    let review = this.buildReview();
    this.props.updateReview(this.props.token, review, null);
  }

  complete() {
    let review = this.buildReview();
    review.completed = true;
    this.props.updateReview(this.props.token, review, response => {
      if (response.status >= 400) this.handleCompletionError(response);
      else this.reviewCompleted(response.data);
    });
  }

  reviewCreated(review) {
    this.setState({
      landingPage: false,
      questionPage: true,
      commentsPage: false,
      developmentPlan: false,
      thankYouPage: false,
      reviewId: review.id
    });
    this.props.startReview({
      reviewType: STRENGTH,
      reviewId: review.id,
      managerId: this.state.manager.id,
      managerToken: this.state.managerToken,
      other: {
          requestId: this.props.assessmentRequest.id,
          landingPage: false,
          questionPage: true,
          commentsPage: false,
          developmentPlan: false,
          thankYouPage: false,
          currentQuestion: 0
      }
    });
  }

  handleCompletionError(response) {
    if (!response.data) return;
    let data = response.data;
    let newState = {
      landingPage: false,
      questionPage: false,
      commentsPage: true,
      developmentPlan: false,
      thankYouPage: false
    };
    if (data.employee_comments && data.employee_comments.length)
      newState.employee_comments_errors = data.employee_comments;
    else newState.employee_comments_errors = [];
    if (data.reviewers_comments && data.reviewers_comments.length)
      newState.reviewers_comments_errors = data.reviewers_comments;
    else newState.reviewers_comments_errors = [];
    this.setState(newState);
  }

  reviewCompleted(review) {
    this.setState({
      landingPage: false,
      questionPage: false,
      commentsPage: false,
      developmentPlan: false,
      thankYouPage: true
    });
    this.props.stopReviewInProgress();
  }

  managerUsernameChanged(e) {
    this.setState({ managerUsername: e.target.value });
  }

  managerPasswordChanged(e) {
    this.setState({ managerPassword: e.target.value });
  }

  managerLogin() {
    let credentials = {
      username: this.state.managerUsername,
      password: this.state.managerPassword
    };

    axios
      .create({
        baseURL: "/api/v1/",
        headers: { Authorization: "Token " + this.props.token }
      })
      .post("manager-login/", credentials)
      .then(({ data }) => {
        let manager = this.props.people.find(
          ({ user }) => user.username === this.state.managerUsername
        );
        if (manager) {
          let jobDescription = this.props.jobDescriptions.find(
            ({ id }) => id === manager.job_description
          );
          this.setState({
            manager,
            managerJobDescription: jobDescription,
            managerToken: data.token
          });
        }
      })
      .catch(error => {
        this.setState({ managerLoginError: error.response.data.detail });
      });
  }

  resume() {
    this.setState({
      landingPage: false,
      questionPage: true,
      commentsPage: false,
      developmentPlan: false,
      thankYouPage: false,
      progressCheck: false
    });
  }

  initialState() {
    let state = {
      managerLoginError: "",
      managerToken: "",
      manager: null,
      managerJobDescription: null,
      managerUsername: "",
      managerPassword: "",
      landingPage: true,
      questionPage: false,
      commentsPage: false,
      developmentPlan: false,
      thankYouPage: false,
      progressCheck: false,
      currentQuestion: 0,
      questions: [],
      reviewId: 0,
      reviewerComments: "",
      employeeComments: "",
      completed: false,
      employee_comments_errors: [],
      reviewers_comments_errors: []
    };

    state.questions = this.props.allValues.map(v => ({
      value: v.id,
      statement: v.statement
    }));

    state.questions = state.questions.concat([
      {
        development: "SKILL",
        statement: `I produce quality work that is valued by customers, peers, supervisors, and ${
          this.props.company ? this.props.company.name : ""
        }`
      },
      {
        development: "KNOWLEDGE",
        statement: `I value staying current and understand that it is part of my future success at ${
          this.props.company ? this.props.company.name : ""
        }`
      },
      {
        development: "PASSION",
        statement: "PASSION STATEMENT"
      },
      {
        development: "WISDOM",
        statement: "WISDOM STATEMENT"
      }
    ]);
    return state;
  }

  discard() {
    //Delete the review on the server
    this.props.deleteReview(
      this.props.token,
      { id: this.state.reviewId, manager_token: this.state.managerToken },
      () => {
        //Revert the state of this component to the initial defaults
        this.setState(this.initialState());
      }
    );
    
  }

  render() {
    return (
      <div className="strength-assessment-review">
        {this.state.progressCheck && (
          <ProgressCheck
            {...this.props}
            {...this.state}
            resume={this.resume}
            discard={this.discard}
          />
        )}
        {!this.state.progressCheck && (
          <div>
            {this.state.landingPage && (
              <LandingPage
                {...this.props}
                {...this.state}
                begin={this.begin}
                managerUsernameChanged={this.managerUsernameChanged}
                managerPasswordChanged={this.managerPasswordChanged}
                managerLogin={this.managerLogin}
              />
            )}
            {this.state.questionPage && (
              <Question
                {...this.props}
                {...this.state}
                reviewClicked={this.reviewClicked}
                devPlanClicked={this.devPlanClicked}
                commentsClicked={this.commentsClicked}
                previous={this.previousQuestion}
                next={this.nextQuestion}
              />
            )}
            {this.state.developmentPlan && (
              <EmbeddedDevPlan
                {...this.props}
                {...this.state}
                reviewClicked={this.reviewClicked}
                devPlanClicked={this.devPlanClicked}
                commentsClicked={this.commentsClicked}
                reviewId={this.state.reviewId}
              />
            )}
            {this.state.commentsPage && (
              <CommentsPage
                {...this.props}
                {...this.state}
                reviewerCommentsChanged={this.reviewerCommentsChanged}
                employeeCommentsChanged={this.employeeCommentsChanged}
                backClicked={this.reviewClicked}
                reviewClicked={this.reviewClicked}
                devPlanClicked={this.devPlanClicked}
                completeClicked={this.complete}
                updateReview={this.updateReview}
              />
            )}
            {this.state.thankYouPage && (
              <div className="thank-you">
                <h3>Thank you, your Review has been completed.</h3>
                <div>
                  Click <Link to="/">here</Link> to return the the dashboard.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let props = {
    assessmentRequest: null,
    personAssessed: null,
    company: null,
    jobDescription: null,
    companyDepartment: null,
    reviewer: null,
    reviewerJobDescription: null,
    allRequests: [],
    allAssessments: [],
    allAssessmentValues: [],
    allValues: [],
    token: "",
    people: [],
    jobDescriptions: [],
    progressCheck: false,
    review: null,
    reviewInProgress: null
  };

  const parsedQueryString = querystring.parse(ownProps.location.search);

  if (parsedQueryString.reviewId) {
    let review = state.strengthAssessmentReviews.items.find(
      ({ id }) => id === parseInt(parsedQueryString.reviewId, 10)
    );
    if (review) {
      props.review = review;
      props.progressCheck = true;
    }
  }

  if (
    parsedQueryString.progresscheck &&
    parsedQueryString.progresscheck === "false"
  ) {
    props.progressCheck = false;
  }

  if (state.reviewInProgress.reviewInProgress)
    props.reviewInProgress = state.reviewInProgress;

  props.people = state.people.items;
  props.jobDescriptions = state.jobDescriptions.items;

  let me = state.me;
  if (!me) return props;
  props.reviewer = me;

  let reviewerJobDescription = state.jobDescriptions.items.find(
    ({ id }) => id === me.job_description
  );
  if (!reviewerJobDescription) return props;
  props.reviewerJobDescription = reviewerJobDescription;

  let request = state.strengthAssessmentRequests.items.find(
    ({ id }) => id === parseInt(ownProps.match.params.assessmentRequestId, 10)
  );
  if (!request) return props;
  props.assessmentRequest = request;

  let personAssessed = state.people.items.find(
    ({ id }) => id === request.person_assessed
  );
  if (!personAssessed) return props;
  props.personAssessed = personAssessed;

  let company = state.companies.items.find(
    ({ id }) => id === personAssessed.company
  );
  if (!company) return props;
  props.company = company;

  let jobDescription = state.jobDescriptions.items.find(
    ({ id }) => id === personAssessed.job_description
  );
  if (!jobDescription) return props;
  props.jobDescription = jobDescription;

  let companyDepartment = state.companyDepartments.items.find(
    ({ id }) => id === jobDescription.company_department
  );
  if (!companyDepartment) return props;
  props.companyDepartment = companyDepartment;

  props.allRequests = state.strengthAssessmentRequests.items
    .filter(
      ar =>
        ar.person_assessed === personAssessed.id &&
        moment(ar.request_date).isSameOrBefore(request.request_date)
    )
    .sort((a, b) => moment(b.request_date).diff(a.request_date));

  let requestIds = props.allRequests.map(ar => ar.id);
  props.allAssessments = state.strengthAssessments.items.filter(sa =>
    requestIds.includes(sa.assessment_request)
  );

  let assessmentIds = props.allAssessments.map(sa => sa.id);
  props.allAssessmentValues = state.strengthAssessmentValues.items.filter(av =>
    assessmentIds.includes(av.strength_assessment)
  );

  props.allValues = state.values.items.filter(
    v => v.company === personAssessed.company
  );

  props.token = state.apiToken.value;

  return props;
};

const mapDispatchToProps = dispatch => ({
  createReview: (token, review, callback) => {
    dispatch(createReview(token, review, callback));
  },
  updateReview: (token, review, callback) => {
    dispatch(updateReview(token, review, callback));
  },
  deleteReview: (token, review, callback) => {
    dispatch(deleteReview(token, review, callback));
  },
  startReview: reviewInfo => {
    dispatch(startReview(reviewInfo));
  },
  stopReviewInProgress: () => {
    dispatch(stopReview());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(
  StrengthAssessmentReview
);
