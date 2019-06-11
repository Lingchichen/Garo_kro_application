import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { fetchMe } from "ducks/Me";
import { fetchCountries } from "ducks/Countries";
import { fetchProvinces } from "ducks/Provinces";
import { fetchCompanyCategories } from "ducks/CompanyCategories";
import { fetchCompanies } from "ducks/Companies";
import { fetchAttendeeTypes } from "ducks/AttendeeTypes";
import { fetchDepartments } from "ducks/Departments";
import { fetchMeetingTypes } from "ducks/MeetingTypes";
import { fetchMeetings } from "ducks/Meetings";
import { fetchMeetingSections } from "ducks/MeetingSections";
import { fetchMeetingTopics } from "ducks/MeetingTopics";
import { fetchCompanyDepartments } from "ducks/CompanyDepartments";
import { fetchJobCategories } from "ducks/JobCategories";
import { fetchJobDescriptions } from "ducks/JobDescriptions";
import { fetchPeople } from "ducks/People";
import { fetchMeetingAttendance } from "ducks/MeetingAttendance";
import { fetchMeetingProgressNotes } from "ducks/MeetingProgressNotes";
import { fetchMeetingParkingLots } from "ducks/MeetingParkingLots";
import { fetchGrowthClasses } from "ducks/GrowthClasses";
import { fetchTeams } from "ducks/Teams";
import { fetchTeamMembers } from "ducks/TeamMembers";
import { fetchSuccesses } from "ducks/Successes";
import { fetchChallenges } from "ducks/Challenges";
import { fetchStatuses } from "ducks/Statuses";
import { fetchProjects } from "ducks/Projects";
import { fetchMilestones } from "ducks/Milestones";
import { fetchProjectMilestoneDevelopmentStepStatuses } from "ducks/ProjectMilestoneDevelopmentStepStatuses";
import { fetchValues } from "ducks/Values";
import { fetchStrengthAssessmentRequests } from "ducks/StrengthAssessmentRequests";
import { fetchAssessmentRequestPeople } from "ducks/AssessmentRequestPeople";
import { fetchStrengthAssessments } from "ducks/StrengthAssessments";
import { fetchStrengthAssessmentValues } from "ducks/StrengthAssessmentValues";
import { fetchStrengthAssessmentReviews } from "ducks/StrengthAssessmentReviews";
import { fetchPerformanceReviews } from "ducks/PerformanceReviews";
import { fetchEmployeeDevelopmentPlanReviews } from "ducks/EmployeeDevelopmentPlanReviews";
import { fetchEmployeeDevelopmentPlanActionSteps } from "ducks/EmployeeDevelopmentPlanActionSteps";
import Box from "components/Box";
import CompanySelect from "./scenes/CompanySelect";
import TopBar from "./containers/TopBar";
import SideBar from "./containers/SideBar";
import Meetings from "./scenes/Meetings";
import Home from "./scenes/Home";
import Development from "./scenes/Development";
import Projects from "./scenes/Projects";
import "./style.css";

const Analytics = () => <h3 style={{ textAlign: "center" }}>Analytics</h3>;

const Calendar = () => <h3 style={{ textAlign: "center" }}>Calendar</h3>;

const Tools = () => <h3 style={{ textAlign: "center" }}>Tools</h3>;

const NoMatch = () => (
  <h3 style={{ textAlign: "center" }}>404 - Page not found</h3>
);

class App extends Component {
  componentDidMount() {
    this.props.fetchAll(this.props.apiToken);
  }

  render() {
    let companySelect =
      this.props.isStaff && this.props.defaultCompany === null;
    return (
      <BrowserRouter>
        <div>
          {companySelect && <CompanySelect />}
          {!companySelect && (
            <div className="app">
              <TopBar />
              <SideBar />
              <Box className="app-content">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/analytics" component={Analytics} />
                  <Route path="/calendar" component={Calendar} />
                  <Route path="/meetings" component={Meetings} />
                  <Route path="/development" component={Development} />
                  <Route path="/tools" component={Tools} />
                  <Route path="/projects" component={Projects} />
                  <Route component={NoMatch} />
                </Switch>
              </Box>
            </div>
          )}
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({
  apiToken: state.apiToken.value,
  isStaff: state.me.user.is_staff,
  defaultCompany: state.defaultCompany
});

const mapDispatchToProps = dispatch => ({
  fetchAll: token => {
    dispatch(fetchMe(token));
    dispatch(fetchMeetings());
    dispatch(fetchMeetingTypes());
    dispatch(fetchAttendeeTypes());
    dispatch(fetchDepartments());
    dispatch(fetchCompanies());
    dispatch(fetchProvinces());
    dispatch(fetchCountries());
    dispatch(fetchCompanyCategories());
    dispatch(fetchMeetingSections());
    dispatch(fetchMeetingTopics());
    dispatch(fetchCompanyDepartments(token));
    dispatch(fetchJobCategories(token));
    dispatch(fetchJobDescriptions(token));
    dispatch(fetchPeople(token));
    dispatch(fetchMeetingAttendance(token));
    dispatch(fetchMeetingProgressNotes(token));
    dispatch(fetchMeetingParkingLots(token));
    dispatch(fetchGrowthClasses(token));
    dispatch(fetchTeams(token));
    dispatch(fetchTeamMembers(token));
    dispatch(fetchSuccesses(token));
    dispatch(fetchChallenges(token));
    dispatch(fetchStatuses(token));
    dispatch(fetchProjects(token));
    dispatch(fetchMilestones(token));
    dispatch(fetchProjectMilestoneDevelopmentStepStatuses(token));
    dispatch(fetchValues(token));
    dispatch(fetchStrengthAssessmentRequests(token));
    dispatch(fetchAssessmentRequestPeople(token));
    dispatch(fetchStrengthAssessments(token));
    dispatch(fetchStrengthAssessmentValues(token));
    dispatch(fetchStrengthAssessmentReviews(token));
    dispatch(fetchPerformanceReviews(token));
    dispatch(fetchEmployeeDevelopmentPlanReviews(token));
    dispatch(fetchEmployeeDevelopmentPlanActionSteps(token));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
