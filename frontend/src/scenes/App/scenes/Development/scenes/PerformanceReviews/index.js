import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import moment from "moment";
import { updateReview } from "ducks/PerformanceReviews";
import { saveReview } from "ducks/PerformanceReviews";
import {createReview} from "ducks/PerformanceReviews";
import "./style.css";
import LandingPage from "./LandingPage";
import ReviewPage from "./ReviewPage";
import ThankPage  from "./ThankPage";
import DevPlanPage from "./DevPlanPage"
class PerformanceReview extends Component{
  constructor(props) {
    super(props);
    this.begin = this.begin.bind(this);
    this.performanceReviewClicked= this.performanceReviewClicked.bind(this);
    this.reviewClicked=this.reviewClicked.bind(this);
    this.devPlanClicked = this.devPlanClicked.bind(this);
    this.completeClicked = this.completeClicked.bind(this);
    this.overallPerformanceChanged = this.overallPerformanceChanged.bind(this);
    this.saveComments = this.saveComments.bind(this);
    this.strengthsChanged = this.strengthsChanged.bind(this);
    this.furtherDevelopmentChanged = this.furtherDevelopmentChanged.bind(this);
    this.challengesChanged = this.challengesChanged.bind(this);
    this.employeeCommentsChanged = this.employeeCommentsChanged.bind(this);
    this.reviewSaved = this.reviewSaved.bind(this);
    this.managerUsernameChanged = this.managerUsernameChanged.bind(this);
    this.managerPasswordChanged = this.managerPasswordChanged.bind(this);
    this.managerLogin = this.managerLogin.bind(this);
    this.buildReview=this.buildReview.bind(this);
    this.reviewCreated=this.reviewCreated.bind(this);
    this.reviewUpdated = this.reviewUpdated.bind(this);
    this.handleCompletionError=this.handleCompletionError.bind(this);
    this.componentWillUnmount=this.componentWillUnmount.bind(this);
    this.state = {
      managerLoginError: "",
      managerToken: "",
      manager: null,
      managerJobDescription: null,
      managerUsername: "",
      managerPassword: "",
      landingPage: true,
      reviewPage:false,
      thankPage:false,
      reviewId:0,
      devPlanPage: false,
      overall_performance:"",
      strengths:"",
      areas_for_further_development:"",
      challenges:"",
      employee_comments:"",
      completed:false,
      overall_performance_error: [],
      strengths_errors: [],
      areas_for_further_development_errors:[],
      challenges_errors:[],
      employee_comments_errors:[]


    };
  }

  overallPerformanceChanged(e){
    this.setState({overall_performance: e.target.value});
  }
  strengthsChanged(e){
    this.setState({strengths: e.target.value});
  }
  furtherDevelopmentChanged(e){
    this.setState({areas_for_further_development: e.target.value});
  }
  challengesChanged(e){
    this.setState({challenges: e.target.value});
  }
  employeeCommentsChanged(e){
    this.setState({employee_comments: e.target.value});
  }


  begin() {
    let review = this.buildReview();
    this.props.createReview(this.props.token, review, this.reviewCreated);
    console.log('id')
    console.log(review.id)

  }
  reviewCreated(review){
    this.setState({
      landingPage: false, reviewPage: true ,devPlanPage:false,thankPage:false,reviewId:review.id
    });
  }
  reviewClicked(){
    this.setState({
      devPlanPage:false,
      landingPage: true,
      reviewPage: false,
      thankPage: false
    });

  }
  devPlanClicked(){
    this.setState({
      devPlanPage:true,
      landingPage: false,
      reviewPage: false,
      thankPage: false
    });

  }
  performanceReviewClicked() {
    this.setState({
      devPlanPage:false,
      landingPage: false,
      reviewPage: true,
      thankPage: false
    });
  }
  buildReview(){
    return {
      id: this.state.reviewId,
      person_reviewed :this.props.personAssessed.id,
      reviewed_by_person:this.state.manager.id,
      review_period_from : moment().format(),
      review_period_to :moment().format(),
      overall_performance : this.state.overall_performance,
      strengths : this.state.strengths,
      areas_for_further_development : this.state.areas_for_further_development,
      challenges : this.state.challenges,
      employee_comments : this.state.employee_comments,
      manager_token : this.state.managerToken,
      overall_performance_msg:'',
      strengths_msg:'',
      areas_for_further_development_msg:'',
      challenges_msg:'',
      employee_comments_msg:'',

    };
  }
  saveComments(){
    let review = {};
    review.completed=this.state.completed
    console.log(review.completed)
    if (! review.completed) {
      console.log('hi');
      review.person_reviewed = this.props.personAssessed.id;
      review.reviewed_by_person = this.state.manager.id;
      review.review_period_from = moment().format();
      review.review_period_to = moment().format();
      review.overall_performance = this.state.overall_performance;
      review.strengths = this.state.strengths;
      review.areas_for_further_development = this.state.areas_for_further_development;
      review.challenges = this.state.challenges;
      review.employee_comments = this.state.employee_comments;
      review.manager_token = this.state.managerToken;
      review.id = this.state.reviewId;
      //this.props.performanceReviews.length+1
      console.log( review.id)
      this.props.updateReview(this.props.token,review,this.reviewUpdated);
    }
    console.log(review)
  }

  reviewUpdated(review){
    //In case we need to update anything after request succeeds
  }
  componentWillUnmount(){
    console.log('reviewId');
    console.log(this.state.reviewId);
    if(this.state.reviewId){
      console.log(true);
      this.updateReview();}

    this.setState({
      devPlanPage:false,
      landingPage: true,
      reviewPage: false,
      thankPage: false
    });
  }
  updateReview() {
    let review = this.buildReview();
    this.props.updateReview(this.props.token, review, null);
  }
  completeClicked(){
    let review = {};
    review.person_reviewed = this.props.personAssessed.id;
    review.reviewed_by_person = this.state.manager.id;
    review.review_period_from = moment().format();
    review.review_period_to = moment().format();
    review.overall_performance = this.state.overall_performance;
    review.strengths = this.state.strengths;
    review.areas_for_further_development = this.state.areas_for_further_development;
    review.challenges = this.state.challenges;
    review.employee_comments = this.state.employee_comments;
    review.manager_token = this.state.managerToken;
    review.id = this.state.reviewId;
    review.completed=this.state.completed
    review.msg
    console.log('overall performance')
    console.log(review.overall_performance)
    console.log('strengths')
    console.log(review.strengths)
    console.log('areas_for_further_developemnt')
    console.log(review.areas_for_further_development)
    console.log('review.challenges')
    console.log(review.challenges)
    console.log('review.employee_comments')
    console.log(review.employee_comments)
    if (review.overall_performance&&review.strengths&&review.areas_for_further_development&&review.challenges&&review.employee_comments){
      console.log('finished')
      //go to thankpage
      review.completed=true;
      this.props.updateReview(this.props.token,review,this.reviewSaved);
      console.log(review)
    }
    else{
      console.log('not finished')
      //stay on the review page
      review.completed=true
      this.props.updateReview(this.props.token, review, response => {
        if(response.status >= 400) this.handleCompletionError(response);
        else this.reviewCreated(response.data);
      });

      console.log(review)
    }
  }
  handleCompletionError(response){
    if(!response.data) return;
    let data = response.data;
    let newState = {
      devPlanPage:false,
      landingPage: false,
      reviewPage: true,
      thankPage: false,
    };
    console.log('data')
    console.log(data)
    console.log(data.overall_performance)
    if(data.overall_performance && data.overall_performance.length)
      newState.overall_performance_error = data.overall_performance;
    else newState.overall_performance_error = [];
    if(data.strengths && data.strengths.length)
      newState.strengths_errors = data.strengths;
    else newState.strengths_errors = [];
    if(data.areas_for_further_development && data.areas_for_further_development.length)
      newState.areas_for_further_development_errors = data.areas_for_further_development;
    else newState.areas_for_further_development_errors = [];
    if(data.challenges && data.challenges.length)
      newState.challenges_errors = data.challenges;
    else newState.challenges_errors = [];
    if(data.employee_comments && data.employee_comments.length)
      newState.employee_comments_errors = data.employee_comments;
    else newState.employee_comments_errors = [];
    this.setState(newState);
  }
  reviewSaved(review){
      this.setState({
        devPlanPage:false,
        landingPage: false,
        reviewPage: false,
        thankPage: true,
      });

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
          this.setState({managerLoginError: error.response.data.detail});
        });
    }

    render() {
      return (
        <div className="performance-reviews">
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
          {this.state.reviewPage && (
            <ReviewPage
              {...this.props}
              {...this.state}
              performanceReviewClicked={this.performanceReviewClicked}
              reviewClicked={this.reviewClicked}
              devPlanClicked={this.devPlanClicked}
              completeClicked={this.completeClicked}
              overallPerformanceChanged={this.overallPerformanceChanged}
              strengthsChanged={this.strengthsChanged}
              furtherDevelopmentChanged={this.furtherDevelopmentChanged}
              challengesChanged={this.challengesChanged}
              employeeCommentsChanged={this.employeeCommentsChanged}
              reviewSaved={this.reviewSaved}
              saveComments={this.saveComments}
              componentWillUnmount={this.componentWillUnmount}
            />
          )}
          {this.state.thankPage &&(
            <ThankPage
              {...this.props}
              {...this.state}
            />
          )}
          {this.state.devPlanPage &&(
            <DevPlanPage
            {...this.props}
            {...this.state}
            performanceReviewClicked={this.performanceReviewClicked}
            reviewClicked={this.reviewClicked}
            devPlanClicked={this.devPlanClicked}
            completeClicked={this.completeClicked}
            />
          )}
        </div>
      );
    }
  }
  const mapStateToProps = (state, ownProps) => {
    let props = {
      personAssessed : null,
      jobDescription: null,
      token: null,
      people: [],
      jobDescriptions: [],
      performanceReviews:[]
    };
    props.performanceReviews=state.performanceReviews;
    props.token = state.apiToken.value;
    props.people = state.people.items;
    props.jobDescriptions = state.jobDescriptions.items;

    let me = state.me;
    if (!me) return props;
    props.personAssessed = me;

    let jobDescription = state.jobDescriptions.items.find(
      ({ id }) => id === props.personAssessed.job_description
    );
    if (!jobDescription) return props;
    props.jobDescription = jobDescription;

    let companyDepartments=state.companyDepartments.items.find(
      ({ id }) => id === props.personAssessed.id
    );
    if (!companyDepartments ) return props;
    props.companyDepartments = companyDepartments;

    return props;

  };

  const mapDispatchToProps = dispatch => ({
    createReview:(token,review,callback) =>{
    dispatch(createReview(token,review,callback));
  },
    saveReview: (token, review, callback) => {
    dispatch(saveReview(token, review, callback));
  },
    updateReview:(token,review,callback)=>{
    dispatch(updateReview(token,review,callback));
    }
  });

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceReview);
