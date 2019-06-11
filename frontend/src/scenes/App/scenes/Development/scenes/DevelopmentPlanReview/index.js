import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import { createDevPlanReview, updateDevPlanReview } from "ducks/EmployeeDevelopmentPlanReviews";
import LandingPage from "./LandingPage";
import ReviewPage from "./ReviewPage";
import "./style.css";

class DevelopmentPlanReview extends Component {
  constructor(props) {
    super(props);
    
    this.jobSpecificNeedsChanged = this.jobSpecificNeedsChanged.bind(this);
    this.futureOpportunitiesNeedsChanged = this.futureOpportunitiesNeedsChanged.bind(
      this
    );
    this.jobSpecificClicked = this.jobSpecificClicked.bind(this);
    this.futureOpportunitiesClicked = this.futureOpportunitiesClicked.bind(
      this
    );
    this.begin = this.begin.bind(this);
    this.reviewCreated = this.reviewCreated.bind(this);
    this.updateReview = this.updateReview.bind(this);
    this.reviewUpdated = this.reviewUpdated.bind(this);
    this.completeReview = this.completeReview.bind(this);
    this.reviewCompleted = this.reviewCompleted.bind(this);
    this.managerUsernameChanged = this.managerUsernameChanged.bind(this);
    this.managerPasswordChanged = this.managerPasswordChanged.bind(this);
    this.managerLogin = this.managerLogin.bind(this);
    this.handleCompletionError = this.handleCompletionError.bind(this);
    
    let dateTime = moment().format();
    this.state = {
      managerToken: "",
      manager: null,
      managerJobDescription: null,
      managerUsername: "",
      managerPassword: "",
      landingPage: true,
      jobSpecific: true,
      job_specific_dev_needs: "",
      future_opportunities: "",
      review_period_from: dateTime,
      review_period_to: dateTime,
      reviewId: 0,
      thankYouPage: false,
      job_specific_dev_needs_errors: [],
      future_opportunities_errors: []
    };
  }

  begin() {
    this.props.createDevPlanReview(
      this.props.token,
      {
        person_reviewed: this.props.personAssessed.id,
        reviewed_by: this.state.manager.id,
        review_period_from: this.state.review_period_from,
        review_period_to: this.state.review_period_to,
        job_specific_dev_needs: this.state.job_specific_dev_needs,
        future_opportunities: this.state.future_opportunities,
        manager_token: this.state.managerToken,
        completed: false
      },
      this.reviewCreated
    );
  }

  jobSpecificNeedsChanged(e) {
    this.setState({ job_specific_dev_needs: e.target.value });
  }

  futureOpportunitiesNeedsChanged(e) {
    this.setState({ future_opportunities: e.target.value });
  }

  jobSpecificClicked() {
    this.setState({ jobSpecific: true });
  }

  futureOpportunitiesClicked() {
    this.setState({ jobSpecific: false });
  }

  completeReview() {
    this.props.updateDevPlanReview(
      this.props.token,
      {
        person_reviewed: this.props.personAssessed.id,
        reviewed_by: this.state.manager.id,
        review_period_from: this.state.review_period_from,
        review_period_to: this.state.review_period_to,
        job_specific_dev_needs: this.state.job_specific_dev_needs,
        future_opportunities: this.state.future_opportunities,
        manager_token: this.state.managerToken,
        completed: true,
        id: this.state.reviewId
      },
      response => {
        if(response.status >= 400) this.handleCompletionError(response);
        else this.reviewCompleted(response);
      }
      
    );
  }

  handleCompletionError(response){
    if(!response.data) return;
    let data = response.data;
    let newState = {
      landingPage: false,
      thankYouPage: false
    };
    if(data.job_specific_dev_needs && data.job_specific_dev_needs.length){
      newState.job_specific_dev_needs_errors = data.job_specific_dev_needs;
      newState.jobSpecific = true;
    }
    else newState.job_specific_dev_needs_errors = [];
    if(data.future_opportunities && data.future_opportunities.length){
      newState.future_opportunities_errors = data.future_opportunities;
      if(!newState.jobSpecific) newState.jobSpecific = false;
    }
    else newState.future_opportunities_errors = [];
    this.setState(newState);
  }

  reviewCompleted(review){
    this.setState({thankYouPage: true});
  }

  reviewCreated(review) {
    this.setState({ landingPage: false, reviewId: review.id });
    //this.setState({ thankYouPage: true });
  }

  componentWillUnmount(){
    if(this.state.reviewId) this.updateReview();
  }
  
  updateReview(){
    this.props.updateDevPlanReview(
      this.props.token,
      {
        person_reviewed: this.props.personAssessed.id,
        reviewed_by: this.state.manager.id,
        review_period_from: this.state.review_period_from,
        review_period_to: this.state.review_period_to,
        job_specific_dev_needs: this.state.job_specific_dev_needs,
        future_opportunities: this.state.future_opportunities,
        manager_token: this.state.managerToken,
        completed: false,
        id: this.state.reviewId
      },
      this.reviewUpdated
    );
  }

  reviewUpdated(review){

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
        console.log(error.response);
      });
  }

  render() {
    return (
      <div className="development-plan-review">
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
        {this.state.thankYouPage && (
          <div className="thank-you">
            <h3>Thank you, your Review has been completed.</h3>
            <div>Click <Link to="/">here</Link> to return the the dashboard.</div>
          </div>
        )}
        {!this.state.landingPage && !this.state.thankYouPage && (
          <ReviewPage
            {...this.props}
            {...this.state}
            jobSpecificNeedsChanged={this.jobSpecificNeedsChanged}
            futureOpportunitiesNeedsChanged={
              this.futureOpportunitiesNeedsChanged
            }
            jobSpecificClicked={this.jobSpecificClicked}
            futureOpportunitiesClicked={this.futureOpportunitiesClicked}
            completeClicked={this.completeReview}
            updateReview={this.updateReview}
          />
        )}
      </div>
    );
  }
}

const mapstateToProps = (state, ownProps) => {
  let props = {
    personAssessed: null,
    jobDescription: null,
    companyDepartment: null,
    company: null,
    token: null,
    people: [],
    jobDescriptions: []
  };

  props.people = state.people.items;
  props.jobDescriptions = state.jobDescriptions.items;

  props.token = state.apiToken.value;

  if (!ownProps.match.params.personId) return props;
  let personId = parseInt(ownProps.match.params.personId, 10);

  props.reviewer = state.me;

  let reviewerPosition = state.jobDescriptions.items.find(
    ({ id }) => id === props.reviewer.job_description
  );
  if (!reviewerPosition) return props;
  props.reviewerPosition = reviewerPosition;

  let personAssessed = state.people.items.find(({ id }) => id === personId);
  if (!personAssessed) return props;
  props.personAssessed = personAssessed;

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

  let company = state.companies.items.find(
    ({ id }) => id === personAssessed.company
  );
  if (!company) return props;
  props.company = company;

  return props;
};

const mapDispatchToProps = dispatch => ({
  createDevPlanReview: (token, review, callback) => {
    dispatch(createDevPlanReview(token, review, callback));
  },
  updateDevPlanReview: (token, review, callback) => {
    dispatch(updateDevPlanReview(token, review, callback));
  }
});

export default connect(mapstateToProps, mapDispatchToProps)(DevelopmentPlanReview);
