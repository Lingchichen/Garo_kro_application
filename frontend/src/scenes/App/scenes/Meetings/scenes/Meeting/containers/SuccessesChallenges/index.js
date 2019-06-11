import React from "react";
import { connect } from "react-redux";
import { openModal, SUCCESS, CHALLENGE } from "ducks/Modals";
import Button from "components/Button";
import "./style.css";
import successIcon from "images/successG.png";
import challengeIcon from "images/challengeG.png";
import arrow from "images/ArrowB.png";

const SuccessesChallenges = props => (
  <div className="successes-challenges">
    <div className="box meeting-sidebar successes">
      <div className="header">
        <img src={successIcon} alt="" /> Successes
      </div>
      <ul>
        {props.successes.map(succ => (
          <li key={succ.id}>
            {succ.title}{" "}
            <img
              src={arrow}
              alt=""
              onClick={() => {
                props.openExistingSuccessModal(succ.id, props.meeting);
              }}
            />
          </li>
        ))}
      </ul>
      <Button
        click={() => {
          props.openNewSuccessModal(props.meeting);
        }}
      >
        New Success
      </Button>
    </div>
    <div className="box meeting-sidebar challenges">
      <div className="header">
        <img src={challengeIcon} alt="" /> Challenges
      </div>
      <ul>
        {props.challenges.map(chal => (
          <li key={chal.id}>
            {chal.title}{" "}
            <img
              src={arrow}
              alt=""
              onClick={() => {
                props.openExistingChallengeModal(chal.id, props.meeting);
              }}
            />
          </li>
        ))}
      </ul>
      <Button
        click={() => {
          props.openNewChallengeModal(props.meeting);
        }}
      >
        New Challenge
      </Button>
    </div>
  </div>
);

const mapStateToProps = (state, ownProps) => ({
  successes: state.successes.items.filter(
    ({ meeting }) => meeting === ownProps.meeting
  ),
  challenges: state.challenges.items.filter(
    ({ meeting }) => meeting === ownProps.meeting
  )
});

const mapDispatchToProps = dispatch => ({
  openNewSuccessModal: meeting_id => {
    dispatch(openModal(SUCCESS, { new: true, meeting_id }));
  },
  openExistingSuccessModal: (success_id, meeting_id) => {
    dispatch(openModal(SUCCESS, { new: false, success_id, meeting_id }));
  },
  openNewChallengeModal: meeting_id => {
    dispatch(openModal(CHALLENGE, { new: true, meeting_id }));
  },
  openExistingChallengeModal: (challenge_id, meeting_id) => {
    dispatch(openModal(CHALLENGE, { new: false, challenge_id, meeting_id }));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(
  SuccessesChallenges
);
