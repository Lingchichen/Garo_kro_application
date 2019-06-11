import React, { Component } from "react";
import { connect } from "react-redux";
import { createProject, updateProject } from "ducks/Projects";
import {
  openModal,
  UPDATE_STATUS,
  STATUS_HISTORY,
  TEAM_ASSIGNMENT
} from "ducks/Modals";
import TeamDisplay from "containers/TeamDisplay";
import Button from "components/Button";
import TopGreyBar from "./components/TopGreyBar";
import historyIcon from "images/historyG.png";
import updateIcon from "images/updateG.png";
import stallAlert from "images/StallAlert.png";
import { isStalled } from "utilities/stall-alerts";
import "./style.css";

const StatusBox = props => {
  let pastDue = false;
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  if (props.status && new Date(props.status.new_due_date) < currentDate)
    pastDue = true;
  return (
    <div className="status">
      <div className="status-title">{props.title}</div>
      <div className="status-column">
        <div className={`due-date${pastDue ? " past-due" : ""}`}>
          <div className="label">Due Date</div>
          <input
            type="text"
            disabled
            value={props.status ? props.status.new_due_date : ""}
          />
          {props.stall_alert && (
            <img className="stall-alert" src={stallAlert} alt="" />
          )}
        </div>
        <div className="actual-budget">
          <div className="label">Actual Budget</div>
          <input
            type="text"
            disabled
            value={props.status ? props.status.new_budget : ""}
          />
        </div>
      </div>
      <div className="status-column">
        <div className="current-status">
          <div className="label">Status</div>
          <input
            type="text"
            disabled
            value={props.statusString ? props.statusString : ""}
          />
        </div>
        <div className="percent-complete">
          <div className="label">% Complete</div>
          <input
            type="text"
            disabled
            value={props.status ? props.status.percent_complete : ""}
          />
        </div>
      </div>
      <div className="status-column buttons">
        <Button className="small-btn" click={props.history}>
          <img src={historyIcon} alt="" /> History
        </Button>
        <Button className="small-btn" click={props.update}>
          <img src={updateIcon} alt="" /> Update
        </Button>
      </div>
    </div>
  );
};

class Project extends Component {
  constructor(props) {
    super(props);

    let growthClass = props.growthClasses.length
      ? props.growthClasses[0].id
      : "";

    let department = props.departments.length ? props.departments[0].id : "";

    let meeting = props.match.params.meetingId
      ? parseInt(props.match.params.meetingId, 10)
      : null;

    let stateTemplate = {
      id: null,
      title: "",
      meeting,
      company: this.props.company,
      team: null,
      growth_class: growthClass,
      problem: "",
      opportunity_or_gains: "",
      estimated_budget: "",
      goals: "",
      budget_approved: false,
      budget_department: department,
      stall_alert: false,
      new: false
    };

    this.state = Object.assign({}, stateTemplate, props.project);
    this.state.new = props.project === null;

    this.titleChanged = this.titleChanged.bind(this);
    this.challengeChanged = this.challengeChanged.bind(this);
    this.opportunityChanged = this.opportunityChanged.bind(this);
    this.growthClassChanged = this.growthClassChanged.bind(this);
    this.estimatedBudgetChanged = this.estimatedBudgetChanged.bind(this);
    this.departmentChanged = this.departmentChanged.bind(this);
    this.toggleBudgetApproved = this.toggleBudgetApproved.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
    this.newProjectCreated = this.newProjectCreated.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.showStatusHistory = this.showStatusHistory.bind(this);
    this.projectUpdated = this.projectUpdated.bind(this);
    this.assignTeam = this.assignTeam.bind(this);
  }

  titleChanged(e) {
    this.setState({ title: e.target.value });
  }

  challengeChanged(e) {
    this.setState({ problem: e.target.value });
  }

  opportunityChanged(e) {
    this.setState({ opportunity_or_gains: e.target.value });
  }

  growthClassChanged(e) {
    this.setState({ growth_class: parseInt(e.target.value, 10) });
  }

  estimatedBudgetChanged(e) {
    this.setState({ estimated_budget: e.target.value });
  }

  departmentChanged(e) {
    this.setState({ budget_department: parseInt(e.target.value, 10) });
  }

  toggleBudgetApproved(e) {
    this.setState({ budget_approved: !this.state.budget_approved });
  }

  save() {
    let newProject = {};
    if (!this.state.new) newProject.id = this.state.id;
    newProject.title = this.state.title;
    newProject.meeting = this.state.meeting;
    newProject.company = this.state.company;
    newProject.team = this.state.team;
    newProject.growth_class = this.state.growth_class;
    newProject.problem = this.state.problem;
    newProject.opportunity_or_gains = this.state.opportunity_or_gains;
    newProject.estimated_budget = this.state.estimated_budget;
    newProject.goals = this.state.goals;
    newProject.budget_approved = this.state.budget_approved;
    newProject.budget_department = this.state.budget_department;
    newProject.stall_alert = this.state.stall_alert;
    if (this.state.new)
      this.props.createProject(
        this.props.token,
        newProject,
        this.newProjectCreated
      );
    else
      this.props.updateProject(
        this.props.token,
        newProject,
        this.projectUpdated
      );
  }

  projectUpdated(proj) {
    this.props.history.goBack();
  }

  newProjectCreated(proj) {
    this.setState(
      {
        ...proj,
        new: false
      },
      () => {
        this.props.openUpdateStatusModal({
          type: "Project",
          project: this.state.id
        });
        this.props.history.replace(`/projects/${this.state.id}`);
      }
    );
  }

  cancel() {
    this.props.history.push(`/meetings/${this.state.meeting}`);
  }

  updateStatus() {
    this.props.openUpdateStatusModal({
      type: "Project",
      project: this.state.id,
      currentStatus: this.props.currentStatus
    });
  }

  showStatusHistory() {
    this.props.openStatusHistoryModal({
      type: "Project",
      project: this.state.id
    });
  }

  assignTeam() {
    this.props.openTeamAssignmentModal(
      this.state.team,
      `Project "${this.state.title}"`,
      this.state.company,
      team => {
        this.setState({ team });
      }
    );
  }

  render() {
    return (
      <div className="project">
        <h3 className="text-center">{`${
          this.state.new ? "New " : ""
        }Project`}</h3>
        <TopGreyBar
          history={this.props.history}
          project={true}
          projectId={this.state.id}
          showMilestones={!this.state.new}
          milestones={this.props.milestones}
          meetingId={this.state.meeting}
        />
        <div className="project-form">
          <div className="title">
            <div className="label">Project Title</div>
            <input
              type="text"
              value={this.state.title}
              onChange={this.titleChanged}
            />
          </div>
          <div className="project-fields">
            <div className="challenge">
              <div className="label">Challenge</div>
              <textarea
                value={this.state.problem}
                onChange={this.challengeChanged}
              />
            </div>
            <div className="opportunity-or-gain">
              <div className="label">
                Opportunity<br />or Gain
              </div>
              <textarea
                value={this.state.opportunity_or_gains}
                onChange={this.opportunityChanged}
              />
            </div>
            <div className="growth-class">
              <div className="label">Growth Class</div>
              <select
                value={this.state.growth_class}
                onChange={this.growthClassChanged}
              >
                {this.props.growthClasses.map(gc => (
                  <option key={gc.id} value={gc.id}>
                    {gc.display_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="assigned-team">
            <TeamDisplay
              teamId={this.state.team}
              assignClicked={this.assignTeam}
            />
          </div>
          <div className="estimated-budget">
            <div className="label">Est. Budget</div>
            <input
              type="text"
              value={this.state.estimated_budget}
              onChange={this.estimatedBudgetChanged}
            />
          </div>
          <div className="department">
            <div className="label">Department</div>
            <select
              value={this.state.budget_department}
              onChange={this.departmentChanged}
            >
              {this.props.departments.map(d => (
                <option key={d.id} value={d.id}>
                  {d.display_name}
                </option>
              ))}
            </select>
          </div>
          <div className="budget-approved">
            <div
              className={
                "radio-button" + (this.state.budget_approved ? " active" : "")
              }
              onClick={this.toggleBudgetApproved}
            />{" "}
            Approved?
          </div>
          <div className="buttons">
            <Button click={this.save}>Save</Button>
            <Button click={this.cancel}>Cancel</Button>
          </div>
          {!this.state.new && (
            <StatusBox
              title="Project Status"
              history={this.showStatusHistory}
              update={this.updateStatus}
              status={this.props.currentStatus}
              statusString={this.props.statusString}
              stall_alert={isStalled(this.props.statusHistory)}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let project = null;

  let meetingId = ownProps.match.params.meetingId;
  let meeting = null;
  let company = null;
  if (meetingId)
    meeting = state.meetings.items.find(
      ({ id }) => id === parseInt(meetingId, 10)
    );
  if (meeting) company = meeting.company;

  if (ownProps.project !== null && typeof ownProps.project === "object") {
    project = ownProps.project;
  } else if (
    ownProps.project &&
    ownProps.project === parseInt(ownProps.project, 10)
  ) {
    project = state.projects.items.find(({ id }) => id === ownProps.project);
  } else if (ownProps.match.params.projectId) {
    project = state.projects.items.find(
      ({ id }) => id === parseInt(ownProps.match.params.projectId, 10)
    );
  }

  let growthClasses = state.growthClasses.items;
  let departments = state.departments.items;
  let token = state.apiToken.value;

  let projectStatuses = null;
  let statusHistory = [];
  let currentStatus = null;
  let statusString = "";
  let milestones = 0;
  if (project) {
    projectStatuses =
      state.projectMilestoneDevelopmentStepStatuses.items.filter(
        s => s.project === project.id
      ) || null;

    let sortedStatuses =
      projectStatuses.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) ||
      null;
    statusHistory = sortedStatuses;

    currentStatus = sortedStatuses[0] || null;

    if (currentStatus && state.statuses.items.length)
      statusString = state.statuses.items.find(
        ({ id }) => id === currentStatus.status
      ).display_name;
    milestones = state.milestones.items.filter(m => m.project === project.id)
      .length;
  }

  return {
    token,
    project,
    growthClasses,
    departments,
    currentStatus,
    statusString,
    milestones,
    company,
    statusHistory
  };
};

const mapDispatchToProps = dispatch => ({
  openTeamAssignmentModal: (team, heading, company, teamAssembled) => {
    dispatch(
      openModal(TEAM_ASSIGNMENT, { team, heading, company, teamAssembled })
    );
  },
  createProject: (token, newProject, callback) => {
    dispatch(createProject(token, newProject, callback));
  },
  openUpdateStatusModal: params => {
    dispatch(openModal(UPDATE_STATUS, params));
  },
  openStatusHistoryModal: params => {
    dispatch(openModal(STATUS_HISTORY, params));
  },
  updateProject: (token, newProject, callback) => {
    dispatch(updateProject(token, newProject, callback));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
