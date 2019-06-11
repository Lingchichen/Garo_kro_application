import React, { Component } from "react";
import { connect } from "react-redux";
import { createMilestone, updateMilestone } from "ducks/Milestones";
import {
  openModal,
  UPDATE_STATUS,
  STATUS_HISTORY,
  TEAM_ASSIGNMENT
} from "ducks/Modals";
import TeamDisplay from "containers/TeamDisplay";
import Button from "components/Button";
import TopGreyBar from "../../../../components/TopGreyBar";
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

class Milestone extends Component {
  constructor(props) {
    super(props);

    let growthClass = props.growthClasses.length
      ? props.growthClasses[0].id
      : "";

    let department = props.departments.length ? props.departments[0].id : "";

    let stateTemplate = {
      id: null,
      title: "",
      project: props.project,
      meeting: null,
      company: this.props.company,
      team: null,
      growth_class: growthClass,
      problem: "",
      opportunity_or_gains: "",
      estimated_budget: "",
      budget_approved: false,
      budget_department: department,
      stall_alert: false,
      new: false
    };

    this.state = Object.assign({}, stateTemplate, props.milestone);
    this.state.new = props.milestone === null;

    this.titleChanged = this.titleChanged.bind(this);
    this.challengeChanged = this.challengeChanged.bind(this);
    this.opportunityChanged = this.opportunityChanged.bind(this);
    this.growthClassChanged = this.growthClassChanged.bind(this);
    this.estimatedBudgetChanged = this.estimatedBudgetChanged.bind(this);
    this.departmentChanged = this.departmentChanged.bind(this);
    this.toggleBudgetApproved = this.toggleBudgetApproved.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
    this.newMilestoneCreated = this.newMilestoneCreated.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.showStatusHistory = this.showStatusHistory.bind(this);
    this.milestoneUpdated = this.milestoneUpdated.bind(this);
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
    let newMilestone = {};
    if (!this.state.new) newMilestone.id = this.state.id;
    newMilestone.title = this.state.title;
    newMilestone.project = this.state.project;
    newMilestone.meeting = this.state.meeting;
    newMilestone.team = this.state.team;
    newMilestone.growth_class = this.state.growth_class;
    newMilestone.problem = this.state.problem;
    newMilestone.opportunity_or_gains = this.state.opportunity_or_gains;
    newMilestone.estimated_budget = this.state.estimated_budget;
    newMilestone.goals = this.state.goals;
    newMilestone.budget_approved = this.state.budget_approved;
    newMilestone.budget_department = this.state.budget_department;
    newMilestone.stall_alert = this.state.stall_alert;
    if (this.state.new)
      this.props.createMilestone(
        this.props.token,
        newMilestone,
        this.newMilestoneCreated
      );
    else
      this.props.updateMilestone(
        this.props.token,
        newMilestone,
        this.milestoneUpdated
      );
  }

  milestoneUpdated(milestone) {
    this.props.history.goBack();
  }

  newMilestoneCreated(milestone) {
    this.setState(
      {
        ...milestone,
        new: false
      },
      () => {
        this.props.openUpdateStatusModal({
          type: "Milestone",
          milestone: this.state.id
        });
        this.props.history.replace(
          `/projects/${this.props.project}/milestones/${this.state.id}`
        );
      }
    );
  }

  cancel() {
    //this.props.history.goBack();
    this.props.history.push(`/projects/${this.props.project}/milestones`);
  }

  updateStatus() {
    this.props.openUpdateStatusModal({
      type: "Milestone",
      milestone: this.state.id,
      currentStatus: this.props.currentStatus
    });
  }

  showStatusHistory() {
    this.props.openStatusHistoryModal({
      type: "Milestone",
      milestone: this.state.id
    });
  }

  assignTeam() {
    this.props.openTeamAssignmentModal(
      this.state.team,
      `Milestone "${this.state.title}"`,
      this.state.company,
      team => {
        this.setState({ team });
      }
    );
  }

  render() {
    return (
      <div className="milestone">
        <h3 className="text-center">{`${
          this.state.new ? "New " : ""
        }Milestone`}</h3>
        <TopGreyBar
          history={this.props.history}
          milestonesActive={true}
          projectId={this.props.project}
          showMilestones={true}
          milestones={this.props.milestoneCount}
        />
        <div className="milestone-form">
          <div className="title">
            <div className="label">Milestone Title</div>
            <input
              type="text"
              value={this.state.title}
              onChange={this.titleChanged}
            />
          </div>
          <div className="milestone-fields">
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
  let project = parseInt(ownProps.match.params.projectId, 10);
  let milestone = null;
  let company = null;
  let projectObj = state.projects.items.find(({ id }) => id === project);
  if (projectObj) company = projectObj.company;

  if (ownProps.milestone !== null && typeof ownProps.milestone === "object") {
    milestone = ownProps.milestone;
  } else if (
    ownProps.milestone &&
    ownProps.milestone === parseInt(ownProps.milestone, 10)
  ) {
    milestone = state.milestones.items.find(
      ({ id }) => id === ownProps.milestone
    );
  } else if (ownProps.match.params.milestoneId) {
    milestone = state.milestones.items.find(
      ({ id }) => id === parseInt(ownProps.match.params.milestoneId, 10)
    );
  }

  let growthClasses = state.growthClasses.items;
  let departments = state.departments.items;
  let token = state.apiToken.value;

  let milestoneStatuses = null;
  let statusHistory = [];
  let currentStatus = null;
  let statusString = "";
  let milestoneCount = 0;
  if (milestone) {
    milestoneStatuses =
      state.projectMilestoneDevelopmentStepStatuses.items.filter(
        s => s.milestone === milestone.id
      ) || null;

    let sortedStatuses =
      milestoneStatuses.sort(
        (a, b) => Date.parse(b.date) - Date.parse(a.date)
      ) || null;
    statusHistory = sortedStatuses;

    currentStatus = sortedStatuses[0] || null;

    if (currentStatus && state.statuses.items.length)
      statusString = state.statuses.items.find(
        ({ id }) => id === currentStatus.status
      ).display_name;
  }
  milestoneCount = state.milestones.items.filter(m => m.project === project)
    .length;

  return {
    token,
    milestone,
    growthClasses,
    departments,
    currentStatus,
    statusString,
    milestoneCount,
    project,
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
  createMilestone: (token, newMilestone, callback) => {
    dispatch(createMilestone(token, newMilestone, callback));
  },
  openUpdateStatusModal: params => {
    dispatch(openModal(UPDATE_STATUS, params));
  },
  openStatusHistoryModal: params => {
    dispatch(openModal(STATUS_HISTORY, params));
  },
  updateMilestone: (token, newMilestone, callback) => {
    dispatch(updateMilestone(token, newMilestone, callback));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Milestone);
