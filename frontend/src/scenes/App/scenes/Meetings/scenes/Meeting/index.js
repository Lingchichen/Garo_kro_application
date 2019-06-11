import React, { Component } from "react";
import { connect } from "react-redux";
import { openModal, ATTENDANCE } from "ducks/Modals";
import {
  PARKING_LOT,
  PROJECTS,
  SUCCESSES,
  DESCRIPTION,
  setMeetingView
} from "ducks/MeetingTimer";
import LoadingIndicator from "components/LoadingIndicator";
import { parseDate } from "utilities/dates";
import Button from "components/Button";
import peopleIcon from "images/people.png";
import parkingLotIcon from "images/ParkingLot-G.png";
import projectsIcon from "images/projectG.png";
import financialStatementsIcon from "images/financial-statement.png";
import successChallengeIcon from "images/Success-and-Challenge.png";
import Timer from "./containers/MeetingTimer";
import MeetingAgenda from "./containers/MeetingAgenda";
import MeetingSidebar from "./components/MeetingSidebar";
import ParkingLot from "./containers/ParkingLot";
import SuccessesChallenges from "./containers/SuccessesChallenges";
import ProjectsMilestones from "./containers/ProjectsMilestones";
import "./style.css";

class Meeting extends Component {
  constructor(props) {
    super(props);
    this.setCurrentView = this.setCurrentView.bind(this);
    this.state = {
      currentView: props.meetingView
    };
  }

  setCurrentView(view) {
    return () => {
      /*if (this.props.meetingInProgress)*/
      this.props.setMeetingView(view);
      this.setState({ currentView: view });
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.meetingInProgress && nextProps.meetingInProgress)
      this.setState({ currentView: nextProps.meetingView });
  }

  render() {
    let loading = false;

    for (let prop in this.props) {
      if (this.props[prop] === null) {
        loading = true;
        break;
      }
    }

    let date = {};
    let heading = "";

    if (!loading) {
      date = parseDate(this.props.meeting.date_time);
      heading = `${
        this.props.meetingType.meeting_title
      } - ${date.fullMonthName.toUpperCase()} ${date.day}, ${date.year}`;
    }

    return (
      <div>
        {loading && <LoadingIndicator />}
        {!loading && (
          <div className="meeting">
            <h3>{heading}</h3>
            <Button
              className="small-btn attendance"
              click={() => {
                this.props.openAttendanceModal(this.props.meeting.id);
              }}
            >
              <img src={peopleIcon} alt="" /> Attendance
            </Button>
            <div className="meeting-nav">
              <Timer
                meeting={this.props.meeting}
                currentView={this.state.currentView}
              />
              <div className="buttons">
                <Button
                  click={this.setCurrentView(PARKING_LOT)}
                  className={
                    this.state.currentView === PARKING_LOT ? "active" : ""
                  }
                >
                  <img src={parkingLotIcon} alt="" />
                  Parking Lot<br />
                  {(this.props.meetingParkingLots.length || "no") + " issues"}
                </Button>
                <Button
                  click={this.setCurrentView(PROJECTS)}
                  className={
                    this.state.currentView === PROJECTS ? "active" : ""
                  }
                >
                  <img src={projectsIcon} alt="" />
                  Projects &amp;<br />Milestones
                </Button>
                <Button>
                  <img src={financialStatementsIcon} alt="" />
                  Financial<br />Statements
                </Button>
                <Button
                  click={this.setCurrentView(SUCCESSES)}
                  className={
                    this.state.currentView === SUCCESSES ? "active" : ""
                  }
                >
                  <img src={successChallengeIcon} alt="" />
                  Successes &amp;<br />Challenges
                </Button>
              </div>
              <div className="clearfix" />
            </div>
            <div>
              <MeetingAgenda
                sections={this.props.meetingSections}
                topics={this.props.meetingTopics}
                active={this.props.meetingInProgress}
                meeting={this.props.meeting}
              />
              {this.state.currentView === DESCRIPTION && (
                <MeetingSidebar
                  description={this.props.meetingType.description}
                />
              )}
              {this.state.currentView === PARKING_LOT && (
                <ParkingLot meeting={this.props.meeting.id} />
              )}
              {this.state.currentView === SUCCESSES && (
                <SuccessesChallenges meeting={this.props.meeting.id} />
              )}
              {this.state.currentView === PROJECTS && (
                <ProjectsMilestones meeting={this.props.meeting.id} />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
//
const mapStateToProps = (state, { match }) => {
  let meeting =
    state.meetings.items.find(
      ({ id }) => id === parseInt(match.params.meetingId, 10)
    ) || null;

  let meetingSections =
    state.meetingSections.items.filter(
      ({ meeting_type }) => meeting_type === meeting.meeting_type
    ) || null;

  let meetingTopics = state.meetingTopics.items.filter(({ section }) =>
    meetingSections.find(({ id }) => id === section)
  );

  let meetingType =
    state.meetingTypes.items.find(
      ({ id }) => (meeting ? id === meeting.meeting_type : false)
    ) || null;

  let meetingParkingLots = state.meetingParkingLots.items.filter(
    pl => pl.meeting === meeting.id
  );

  let meetingView = state.meetingTimer.meeting_view;

  return {
    meeting,
    meetingSections,
    meetingTopics,
    meetingType,
    meetingInProgress: meeting
      ? state.meetingTimer.meeting_id === meeting.id
      : null,
    meetingParkingLots,
    meetingView
  };
};

const mapDispatchToProps = dispatch => ({
  openAttendanceModal: meeting_id => {
    dispatch(openModal(ATTENDANCE, { meeting_id }));
  },
  setMeetingView: meeting_view => {
    dispatch(setMeetingView(meeting_view));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Meeting);
