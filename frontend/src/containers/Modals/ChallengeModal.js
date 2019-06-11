import React, { Component } from "react";
import { connect } from "react-redux";
import { openModal, closeModal, TEAM_ASSIGNMENT } from "ducks/Modals";
import { createChallenge, updateChallenge } from "ducks/Challenges";
import Button from "components/Button";
import TeamDisplay from "containers/TeamDisplay";

class ChallengeModal extends Component {
  constructor(props) {
    super(props);

    this.titleChanged = this.titleChanged.bind(this);
    this.problemChanged = this.problemChanged.bind(this);
    this.originatorChanged = this.originatorChanged.bind(this);
    this.groupInputChanged = this.groupInputChanged.bind(this);
    this.growthClassChanged = this.growthClassChanged.bind(this);
    this.toggleFinancial = this.toggleFinancial.bind(this);
    this.toggleTeamChallenge = this.toggleTeamChallenge.bind(this);
    this.toggleBrand = this.toggleBrand.bind(this);
    this.toggleIndividual = this.toggleIndividual.bind(this);
    this.save = this.save.bind(this);
    this.assignTeam = this.assignTeam.bind(this);

    this.state = {
      id: 0,
      title: "",
      problem: "",
      originator: (props.attendees.length && props.attendees[0].id) || null,
      group_input: "",
      growth_class: this.props.growthClasses[0].id,
      financial_benefit: false,
      team_benefit: false,
      brand_benefit: false,
      individual_benefit: false,
      team: 0
    };

    if (props.challenge) Object.assign(this.state, props.challenge);
  }

  titleChanged(e) {
    let newTitle = e.target.value;
    this.setState({ title: newTitle });
  }

  problemChanged(e) {
    let newProblem = e.target.value;
    this.setState({ problem: newProblem });
  }

  originatorChanged(e) {
    let newOriginator = parseInt(e.target.value, 10);
    this.setState({ originator: newOriginator });
  }

  groupInputChanged(e) {
    let newGroupInput = e.target.value;
    this.setState({ group_input: newGroupInput });
  }

  growthClassChanged(e) {
    let newGrowthClass = parseInt(e.target.value, 10);
    this.setState({ growth_class: newGrowthClass });
  }

  toggleFinancial(e) {
    this.setState({ financial_benefit: !this.state.financial_benefit });
  }

  toggleTeamChallenge(e) {
    this.setState({ team_benefit: !this.state.team_benefit });
  }

  toggleBrand(e) {
    this.setState({ brand_benefit: !this.state.brand_benefit });
  }

  toggleIndividual(e) {
    this.setState({ individual_benefit: !this.state.individual_benefit });
  }

  save() {
    let newChallenge = {
      meeting: this.props.parameters.meeting_id,
      title: this.state.title,
      problem: this.state.problem,
      originator: this.state.originator,
      group_input: this.state.group_input,
      growth_class: this.state.growth_class,
      financial_benefit: this.state.financial_benefit,
      team_benefit: this.state.team_benefit,
      brand_benefit: this.state.brand_benefit,
      individual_benefit: this.state.individual_benefit,
      team: this.state.team ? this.state.team : null
    };
    if (this.state.id) newChallenge.id = this.state.id;
    if (this.props.parameters.new)
      this.props.createChallenge(this.props.apiToken, newChallenge);
    else this.props.updateChallenge(this.props.apiToken, newChallenge);
    this.props.closeModal();
  }

  assignTeam() {
    this.props.openTeamAssignmentModal(
      this.state.team,
      `Challenge "${this.state.title}"`,
      this.props.company,
      team => {
        this.setState({ team });
      }
    );
  }

  render() {
    return (
      <div className="kro-modal challenge-modal">
        <h3>New Challenge</h3>
        <div className="title">
          <div className="label">Title</div>
          <input
            type="text"
            value={this.state.title}
            onChange={this.titleChanged}
          />
        </div>
        <div className="challenge-fields">
          <div className="problem">
            <div className="label">Problem</div>
            <textarea
              value={this.state.problem}
              onChange={this.problemChanged}
            />
          </div>
          <div className="originator">
            <div className="label">Originator</div>{" "}
            <select
              value={this.state.originator}
              onChange={this.originatorChanged}
            >
              {this.props.attendees
                .sort((a, b) => {
                  if (a.user.last_name < b.user.last_name) return -1;
                  if (a.user.last_name > b.user.last_name) return 1;
                  return 0;
                })
                .map(att => (
                  <option key={att.id} value={att.id}>
                    {att.user.first_name + " " + att.user.last_name}
                  </option>
                ))}
            </select>
          </div>
          <div className="group-input">
            <div className="label">Group Input</div>
            <textarea
              value={this.state.group_input}
              onChange={this.groupInputChanged}
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
          <div className="assigned-team" />
          <div className="challenge-type">
            <div className="label">Challenge Type</div>
            <div
              className={
                "radio-button first" +
                (this.state.financial_benefit ? " active" : "")
              }
              onClick={this.toggleFinancial}
            />{" "}
            Financial
            <div
              className={
                "radio-button" + (this.state.team_benefit ? " active" : "")
              }
              onClick={this.toggleTeamChallenge}
            />{" "}
            Team
            <div
              className={
                "radio-button" + (this.state.brand_benefit ? " active" : "")
              }
              onClick={this.toggleBrand}
            />{" "}
            Brand
            <div
              className={
                "radio-button" +
                (this.state.individual_benefit ? " active" : "")
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
  let attendees = state.meetingAttendance.items
    .filter(att => att.meeting === ownProps.parameters.meeting_id)
    .map(att => state.people.items.find(({ id }) => id === att.person));

  let meeting = state.meetings.items.find(
    ({ id }) => id === ownProps.parameters.meeting_id
  );

  if (meeting) company = meeting.company;

  let challenge = null;
  if (!ownProps.parameters.new)
    challenge = state.challenges.items.find(
      ({ id }) => id === ownProps.parameters.challenge_id
    );

  return {
    apiToken: state.apiToken.value,
    growthClasses: state.growthClasses.items,
    attendees,
    company,
    challenge
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
  createChallenge: (token, newChallenge) => {
    dispatch(createChallenge(token, newChallenge));
  },
  updateChallenge: (token, newChallenge) => {
    dispatch(updateChallenge(token, newChallenge));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeModal);
