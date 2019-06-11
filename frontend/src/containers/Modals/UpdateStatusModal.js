import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { closeModal } from "ducks/Modals";
import { createProjectMilestoneDevelopmentStepStatus } from "ducks/ProjectMilestoneDevelopmentStepStatuses";
import Button from "components/Button";
import PercentageSlider from "../../components/PercentageSlider";

class UpdateStatusModal extends Component {
  constructor(props) {
    super(props);
    let { statuses} = props;
    let project = props.parameters.project ? props.parameters.project : null;
    let milestone = props.parameters.milestone
      ? props.parameters.milestone
      : null;
    let development_plan_step = props.parameters.actionStep
      ? props.parameters.actionStep
      : null;

    this.statusChanged = this.statusChanged.bind(this);
    this.percentChanged = this.percentChanged.bind(this);
    this.commentsChanged = this.commentsChanged.bind(this);
    this.budgetChanged = this.budgetChanged.bind(this);
    this.dueDateChanged = this.dueDateChanged.bind(this);

    this.cancel = this.cancel.bind(this);
    this.save = this.save.bind(this);
    this.statusSaved = this.statusSaved.bind(this);

    /*let status = props.parameters.currentStatus ? props.parameters.currentStatus.status : null;
    if(!status) status = statuses.length ? statuses[0].id : null;*/

    this.state = {
      project,
      milestone,
      development_plan_step,
      status: statuses.length ? statuses[0].id : null,
      percent_complete: props.percentageSlider ? "50" : "0",
      comments: "",
      new_budget: "",
      new_due_date: moment(),

    };

    if (props.parameters.currentStatus) {
      this.state = Object.assign(
        {},
        this.state,
        props.parameters.currentStatus
      );
      this.state.new_due_date = moment(this.state.new_due_date);
    }
  }

  statusChanged(e) {
    this.setState({ status: parseInt(e.target.value, 10) });
  }

  percentChanged(value) {
    this.setState({ percent_complete: `${value}` });
  }

  commentsChanged(e) {
    this.setState({ comments: e.target.value });
  }

  budgetChanged(e) {
    this.setState({ new_budget: e.target.value });
  }

  dueDateChanged(date) {
    this.setState({ new_due_date: date });
  }

  cancel() {
    this.props.closeModal();
  }

  save() {
    let newStatus = Object.assign({}, this.state);
    newStatus.new_due_date = this.state.new_due_date.format("YYYY-MM-DD");
    this.props.createStatus(this.props.token, newStatus, this.statusSaved);
  }

  statusSaved(status) {
    if (this.props.parameters.statusUpdated)
      this.props.parameters.statusUpdated(status);
    this.props.closeModal();
  }

  render() {
    let { type } = this.props.parameters;
    let heading = `Update ${type} Status`;
    let currentBudget = "";
    let currentDueDate = "";
    if (this.props.parameters.currentStatus) {
      currentBudget = this.props.parameters.currentStatus.new_budget;
      currentDueDate = this.props.parameters.currentStatus.new_due_date;
    }

    return (
      <div className="kro-modal update-status-modal">
        <h3>{heading}</h3>
        <div className="title">
          <div className="label">{type}</div>
          <input type="text" value={this.props.title} disabled />
        </div>
        <div className="status">
          <div className="label">Status</div>
          <select value={this.state.status} onChange={this.statusChanged}>
            {this.props.statuses.map(status => (
              <option key={status.id} value={status.id}>
                {status.display_name}
              </option>
            ))}
          </select>
        </div>
        {this.props.percentageSlider && (
          <div className="percent-complete">
            <div className="label">Percent Complete</div>
            <PercentageSlider
              maxValue={100}
              minValue={0}
              value={parseInt(this.state.percent_complete, 10)}
              onChange={this.percentChanged}
            />
          </div>
        )}
        <div className="comments">
          <div className="label">Comments / Notes</div>
          <textarea
            value={this.state.comments}
            onChange={this.commentsChanged}
          />
        </div>
        <div className="gray-box">
          <div className="current-budget">
            <div className="label">Current Budget</div>
            <input type="text" disabled value={currentBudget} />
          </div>
          <div className="new-budget">
            <div className="label">New Budget</div>
            <input
              type="text"
              value={this.state.new_budget}
              onChange={this.budgetChanged}
            />
          </div>
          <div className="current-due-date">
            <div className="label">Current Due Date</div>
            <input type="text" disabled value={currentDueDate} />
          </div>
          <div className="new-due-date">
            <div className="label">New Due Date</div>
            <DatePicker
              fixedHeight
              selected={this.state.new_due_date}
              onChange={this.dueDateChanged}
              dateFormat="YYYY-MM-DD"
              popperPlacement="top"
            />
          </div>

        </div>
        <div className="buttons">
          <Button click={this.save}>Save</Button>
          <Button click={this.cancel}>Cancel</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let title = "";
  let percentageSlider = true;
  if (ownProps.parameters.project) {
    console.log();
    let project_id = ownProps.parameters.project;
    let project = state.projects.items.find(({ id }) => id === project_id);
    if (project) title = project.title;
  } else if (ownProps.parameters.milestone) {
    let milestone_id = ownProps.parameters.milestone;
    let milestone = state.milestones.items.find(
      ({ id }) => id === milestone_id
    );
    if (milestone) title = milestone.title;
  } else if (ownProps.parameters.actionStep) {
    percentageSlider = false;
    let actionStepId = ownProps.parameters.actionStep;
    let actionStep = state.employeeDevelopmentPlanActionSteps.items.find(
      ({ id }) => id === actionStepId
    );
    if (actionStep) title = actionStep.action_step_description;
  }

  return {
    statuses: state.statuses.items,

    token: state.apiToken.value,
    title,
    percentageSlider
  };
};

const mapDispatchToProps = dispatch => ({
  closeModal: () => {
    dispatch(closeModal());
  },
  createStatus: (token, newStatus, callback) => {
    dispatch(
      createProjectMilestoneDevelopmentStepStatus(token, newStatus, callback)
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateStatusModal);
