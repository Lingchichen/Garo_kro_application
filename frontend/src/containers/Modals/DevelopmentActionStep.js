import React, { Component } from "react";
import { connect } from "react-redux";
import {
  openModal,
  closeModal,
  TEAM_ASSIGNMENT,
  UPDATE_STATUS,
  STATUS_HISTORY
} from "ducks/Modals";
import {
  createActionStep,
  updateActionStep
} from "ducks/EmployeeDevelopmentPlanActionSteps";
import { isStalled } from "utilities/stall-alerts";
import Button from "components/Button";
import TeamDisplay from "containers/TeamDisplay";
import historyIcon from "images/historyG.png";
import updateIcon from "images/updateG.png";
import stallAlert from "images/StallAlert.png";

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
          <div className="label">Completion Date</div>
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

class DevelopmentActionStep extends Component {
  constructor(props) {
    super(props);
    this.assignTeam = this.assignTeam.bind(this);
    this.save = this.save.bind(this);
    this.actionStepDescriptionChanged = this.actionStepDescriptionChanged.bind(
      this
    );
    this.growthClassChanged = this.growthClassChanged.bind(this);
    this.measureOfSuccessChanged = this.measureOfSuccessChanged.bind(this);
    this.actionStepCreated = this.actionStepCreated.bind(this);
    this.actionStepUpdated = this.actionStepUpdated.bind(this);
    this.showStatusHistory = this.showStatusHistory.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.statusUpdated = this.statusUpdated.bind(this);

    let source_employee_dev_review = null;
    let source_strength_assessment = null;
    let source_performance_review = null;

    if(props.parameters.reviewType === 'STRENGTH')
      source_strength_assessment = props.parameters.reviewId;
    if(props.parameters.reviewType === 'PERFORMANCE')
      source_performance_review = props.parameters.reviewId;
    if(props.parameters.reviewType === 'DEVELOPMENT')
      source_employee_dev_review = props.parameters.reviewId;

    this.state = {
      new: true,
      id: 0,
      person: props.personId,
      action_step_description: "",
      growth_class: props.growthClasses.length
        ? props.growthClasses[0].id
        : null,
      measure_of_success: "",
      source_employee_dev_review,
      source_strength_assessment,
      source_performance_review,
      team: null,
      currentStatus: props.currentStatus,
      statusString: props.currentStatus ? props.statuses.find(({id}) => id === props.currentStatus.status).display_name : ""
    };

    if (props.actionStep)
      this.state = Object.assign({}, this.state, props.actionStep, {
        new: false
      });
  }

  actionStepDescriptionChanged(e) {
    this.setState({ action_step_description: e.target.value });
  }

  growthClassChanged(e) {
    this.setState({ growth_class: e.target.value });
  }

  measureOfSuccessChanged(e) {
    this.setState({ measure_of_success: e.target.value });
  }

  assignTeam() {
    this.props.openTeamAssignmentModal(
      this.state.team,
      "Action Step",
      this.props.company,
      team => {
        this.setState({ team });
      }
    );
  }

  save() {
    if (this.state.new)
      this.props.createActionStep(
        this.props.token,
        this.state,
        this.actionStepCreated
      );
    else
      this.props.updateActionStep(
        this.props.token,
        this.state,
        this.actionStepUpdated
      );
  }

  actionStepCreated(actionStep) {
    this.setState({ ...actionStep, new: false }, () => {
      this.props.openUpdateStatusModal({
        type: "Action Step",
        actionStep: this.state.id,
        statusUpdated: this.statusUpdated
      });
    });
  }

  actionStepUpdated(actionStep) {
    this.setState({ ...actionStep, new: false }, this.props.closeModal);
  }

  showStatusHistory() {
    this.props.openStatusHistoryModal({
      type: "Development Step",
      developmentStep: this.state.id
    });
  }

  updateStatus() {
    this.props.openUpdateStatusModal({
      type: "Action Step",
      actionStep: this.state.id,
      currentStatus: this.state.currentStatus,
      statusUpdated: this.statusUpdated
    });
  }

  statusUpdated(status) {
    this.setState({
      currentStatus: status,
      statusString: this.props.statuses.find(({id}) => id === status.status).display_name
    });
  }

  render() {
    return (
      <div className="kro-modal development-action-step-modal">
        <h5>Development Action Step</h5>
        <div className="step-fields">
          <div className="description">
            <div className="label">Action Step</div>
            <textarea
              value={this.state.action_step_description}
              onChange={this.actionStepDescriptionChanged}
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
          <div className="measures-of-success">
            <div className="label">Measures of Success</div>
            <textarea
              value={this.state.measure_of_success}
              onChange={this.measureOfSuccessChanged}
            />
          </div>
        </div>
        <div className="assigned-team">
          <TeamDisplay
            teamId={this.state.team}
            assignClicked={this.assignTeam}
          />
        </div>
        <div className="buttons">
          <Button click={this.save}>Save</Button>
          <Button click={this.props.closeModal}>Cancel</Button>
        </div>
        {!this.state.new && (
          <StatusBox
            title="Development Step Status"
            history={this.showStatusHistory}
            update={this.updateStatus}
            status={this.state.currentStatus}
            statusString={this.state.statusString}
            stall_alert={isStalled(this.props.statusHistory)}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let props = {
    token: null,
    actionStep: null,
    personId: 0,
    company: 0,
    growthClasses: [],
    statusHistory: [],
    currentStatus: null,
    statuses: []
  };

  props.statuses = state.statuses.items;
  props.token = state.apiToken.value;
  props.growthClasses = state.growthClasses.items;

  let person = null;
  if (ownProps.parameters.actionStepId) {
    //Edit existing action step
    let stepId = ownProps.parameters.actionStepId;
    let actionStep = state.employeeDevelopmentPlanActionSteps.items.find(
      ({ id }) => id === stepId
    );
    if (!actionStep) return props;
    props.actionStep = actionStep;
    person = state.people.items.find(({ id }) => id === actionStep.person);
  } else if (ownProps.parameters.personId) {
    //Create new action step
    let personId = ownProps.parameters.personId;
    person = state.people.items.find(({ id }) => id === personId);
  }

  if (!person) return props;
  props.personId = person.id;
  props.company = person.company;

  if (props.actionStep) {
    let stepStatuses =
      state.projectMilestoneDevelopmentStepStatuses.items.filter(
        s => s.development_plan_step === props.actionStep.id
      ) || null;
    let sortedStatuses =
      stepStatuses.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) ||
      null;
    props.statusHistory = sortedStatuses;
    if (sortedStatuses.length) {
      props.currentStatus = sortedStatuses[0];
      props.statusString = state.statuses.items.find(
        ({ id }) => id === props.currentStatus.status
      ).display_name;
    }
  }

  return props;
};

const mapDispatchToProps = dispatch => ({
  openTeamAssignmentModal: (team, heading, company, teamAssembled) => {
    dispatch(
      openModal(TEAM_ASSIGNMENT, { team, heading, company, teamAssembled })
    );
  },
  closeModal: () => {
    dispatch(closeModal());
  },
  createActionStep: (token, actionStep, callback) => {
    dispatch(createActionStep(token, actionStep, callback));
  },
  updateActionStep: (token, actionStep, callback) => {
    dispatch(updateActionStep(token, actionStep, callback));
  },
  openUpdateStatusModal: params => {
    dispatch(openModal(UPDATE_STATUS, params));
  },
  openStatusHistoryModal: params => {
    dispatch(openModal(STATUS_HISTORY, params));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(
  DevelopmentActionStep
);
