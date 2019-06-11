import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { openModal, DEVELOPMENT_ACTION_STEP } from 'ducks/Modals';
import Button from 'components/Button';
import arrow from 'images/ArrowB.png';
import './style.css';

class DevelopmentPlan extends Component {
  constructor(props) {
    super(props);
    this.FILTER_ACTIVE = 'FILTER_ACTIVE';
    this.FILTER_COMPLETED = 'FILTER_COMPLETED';

    this.filterActive = this.filterActive.bind(this);
    this.filterCompleted = this.filterCompleted.bind(this);
    this.filteredSteps = this.filteredSteps.bind(this);
    this.newActionStep = this.newActionStep.bind(this);
    this.editActionStep = this.editActionStep.bind(this);

    this.state = {
      filter: this.FILTER_ACTIVE
    };
  }

  filterActive() {
    this.setState({ filter: this.FILTER_ACTIVE });
  }

  filterCompleted() {
    this.setState({ filter: this.FILTER_COMPLETED });
  }

  filteredSteps() {
    return this.props.actionSteps.filter(actionStep => {
      if (actionStep.stepStatus && actionStep.stepStatus.status)
        return this.state.filter === this.FILTER_ACTIVE
          ? actionStep.stepStatus.status.title !== 'CLOSED'
          : actionStep.stepStatus.status.title === 'CLOSED';
      else return false;
    });
  }

  newActionStep() {
    //Open modal
    this.props.openDevelopmentPlanActionStepModal({
      personId: this.props.personId,
      reviewId: this.props.reviewId,
      reviewType: this.props.reviewType
    });
  }

  editActionStep(stepId) {
    return () => {
      this.props.openDevelopmentPlanActionStepModal({
        actionStepId: stepId,
        reviewId: this.props.reviewId,
        reviewType: this.props.reviewType
      });
    };
  }

  render() {
    let steps = this.filteredSteps();
    return (
      <div className="development-plan">
        <div className="head">
          <div className="dev-plan-filters">
            <span className="filter-label">Show Steps</span>
            <span className="filter-active" onClick={this.filterActive}>
              <div
                className={`radio-button${
                  this.state.filter === this.FILTER_ACTIVE ? ' active' : ''
                }`}
              />{' '}
              Active
            </span>
            <span className="filter-completed" onClick={this.filterCompleted}>
              <div
                className={`radio-button${
                  this.state.filter === this.FILTER_COMPLETED ? ' active' : ''
                }`}
              />{' '}
              Completed
            </span>
          </div>
          <div className="new-action-step">
            <Button className="small-btn" click={this.newActionStep}>
              New Action Step
            </Button>
          </div>
        </div>
        <div className="body">
          <table>
            <thead>
              <tr>
                <th>Development Action Steps</th>
                <th>Measures of Success</th>
                <th>Completion Date</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {steps.map(step => (
                <tr key={step.id}>
                  <td>{step.action_step_description}</td>
                  <td>{step.measure_of_success}</td>
                  <td>
                    {step.stepStatus
                      ? moment(step.stepStatus.new_due_date).format(
                          'MMM. DD, YYYY'
                        )
                      : 'Not set.'}
                  </td>
                  <td>
                    <img
                      src={arrow}
                      alt=""
                      onClick={this.editActionStep(step.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let props = {
    personId: 0,
    actionSteps: []
  };

  let personId = ownProps.personId;
  if (!personId) return props;
  props.personId = personId;
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
  props.actionSteps = actionSteps;

  return props;
};

const mapDispatchToProps = dispatch => ({
  openDevelopmentPlanActionStepModal: modalParameters => {
    dispatch(openModal(DEVELOPMENT_ACTION_STEP, modalParameters));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DevelopmentPlan);
