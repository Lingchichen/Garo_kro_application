import React, { Component } from "react";
import { connect } from "react-redux";
import { openModal, closeModal, TEAM_ASSIGNMENT } from "ducks/Modals";
import { createSuccess, updateSuccess } from "ducks/Successes";
import Button from "components/Button";
import TeamDisplay from "containers/TeamDisplay";

class SuccessModal extends Component {
  constructor(props) {
    super(props);

    this.titleChanged = this.titleChanged.bind(this);
    this.descriptionChanged = this.descriptionChanged.bind(this);
    this.growthClassChanged = this.growthClassChanged.bind(this);
    this.benefitSummaryChanged = this.benefitSummaryChanged.bind(this);
    this.toggleFinancial = this.toggleFinancial.bind(this);
    this.toggleTeamSuccess = this.toggleTeamSuccess.bind(this);
    this.toggleBrand = this.toggleBrand.bind(this);
    this.toggleIndividual = this.toggleIndividual.bind(this);
    this.save = this.save.bind(this);
    this.assignTeam = this.assignTeam.bind(this);

    this.state = {
      id: 0,
      title: "",
      description: "",
      growth_class: this.props.growthClasses[0].id,
      benefit_summary: "",
      financial_success: false,
      team_success: false,
      team: 0,
      brand_success: false,
      individual_success: false
    };

    if (props.success) Object.assign(this.state, props.success);
  }

  titleChanged(e) {
    let newTitle = e.target.value;
    this.setState({ title: newTitle });
  }

  descriptionChanged(e) {
    let newDescription = e.target.value;
    this.setState({ description: newDescription });
  }

  growthClassChanged(e) {
    let newGrowthClass = parseInt(e.target.value, 10);
    this.setState({ growth_class: newGrowthClass });
  }

  benefitSummaryChanged(e) {
    let newBenefitSummary = e.target.value;
    this.setState({ benefit_summary: newBenefitSummary });
  }

  toggleFinancial(e) {
    this.setState({ financial_success: !this.state.financial_success });
  }

  toggleTeamSuccess(e) {
    this.setState({ team_success: !this.state.team_success });
  }

  toggleBrand(e) {
    this.setState({ brand_success: !this.state.brand_success });
  }

  toggleIndividual(e) {
    this.setState({ individual_success: !this.state.individual_success });
  }

  save() {
    let newSuccess = {
      meeting: this.props.parameters.meeting_id,
      title: this.state.title,
      description: this.state.description,
      growth_class: this.state.growth_class,
      benefit_summary: this.state.benefit_summary,
      financial_success: this.state.financial_success,
      team_success: this.state.team_success,
      brand_success: this.state.brand_success,
      individual_success: this.state.individual_success,
      team: this.state.team ? this.state.team : null
    };
    if (this.state.id) newSuccess.id = this.state.id;
    if (this.props.parameters.new)
      this.props.createSuccess(this.props.apiToken, newSuccess);
    else this.props.updateSuccess(this.props.apiToken, newSuccess);
    this.props.closeModal();
  }

  assignTeam() {
    this.props.openTeamAssignmentModal(
      this.state.team,
      `Success "${this.state.title}"`,
      this.props.company,
      team => {
        this.setState({ team });
      }
    );
  }

  render() {
    return (
      <div className="kro-modal success-modal">
        <h3>New Success</h3>
        <div className="title">
          <div className="label">Title</div>
          <input
            type="text"
            value={this.state.title}
            onChange={this.titleChanged}
          />
        </div>
        <div className="success-fields">
          <div className="description">
            <div className="label">Description</div>
            <textarea
              value={this.state.description}
              onChange={this.descriptionChanged}
            />
          </div>
          <div className="growth-class">
            <div className="label">Growth Class</div>{" "}
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
          <div className="benefit-summary">
            <div className="label">Benefit Summary</div>
            <textarea
              value={this.state.benefit_summary}
              onChange={this.benefitSummaryChanged}
            />
          </div>
          <div className="success-type">
            <div className="label">Success Type</div>
            <div
              className={
                "radio-button first" +
                (this.state.financial_success ? " active" : "")
              }
              onClick={this.toggleFinancial}
            />{" "}
            Financial
            <div
              className={
                "radio-button" + (this.state.team_success ? " active" : "")
              }
              onClick={this.toggleTeamSuccess}
            />{" "}
            Team
            <div
              className={
                "radio-button" + (this.state.brand_success ? " active" : "")
              }
              onClick={this.toggleBrand}
            />{" "}
            Brand
            <div
              className={
                "radio-button" +
                (this.state.individual_success ? " active" : "")
              }
              onClick={this.toggleIndividual}
            />{" "}
            Individual
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
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let company = 0;

  let meeting = state.meetings.items.find(
    ({ id }) => id === ownProps.parameters.meeting_id
  );

  if (meeting) company = meeting.company;

  let success = null;
  if (!ownProps.parameters.new)
    success = state.successes.items.find(
      ({ id }) => id === ownProps.parameters.success_id
    );

  return {
    apiToken: state.apiToken.value,
    growthClasses: state.growthClasses.items,
    company,
    success
  };
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
  createSuccess: (token, newSuccess) => {
    dispatch(createSuccess(token, newSuccess));
  },
  updateSuccess: (token, newSuccess) => {
    dispatch(updateSuccess(token, newSuccess));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SuccessModal);
