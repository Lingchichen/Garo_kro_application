import React from "react";
import { connect } from "react-redux";
import {
  startMeetingTimer,
  stopMeetingTimer,
  resumeMeetingTimer
} from "ducks/MeetingTimer";
import { timeDisplay } from "utilities/dates";
import time from "images/time.png";
import play from "images/play.png";
import stop from "images/stop.png";
import Button from "components/Button";

const Timer = props => {
  let isThisMeetingRunning =
    props.timer.meeting_id === props.meeting.id && props.timer.running;
  let isThisMeetingPaused =
    props.timer.meeting_id === props.meeting.id && !props.timer.running;
  let meetingDuration =
    Date.parse(props.meeting.end_date_time) -
    Date.parse(props.meeting.start_date_time);

  return (
    <div className="timer" style={{ float: "left" }}>
      <img src={time} alt="" style={{ width: "30px" }} />{" "}
      <span
        style={{
          color:
            (isThisMeetingRunning || isThisMeetingPaused) &&
            props.timer.negative
              ? "red"
              : "black"
        }}
      >
        {isThisMeetingRunning || isThisMeetingPaused
          ? timeDisplay(props.timer.timeLeft)
          : timeDisplay(meetingDuration)}
      </span>{" "}
      <Button
        className="small-btn"
        click={() => {
          if (isThisMeetingRunning) props.stopTimer();
          else if (isThisMeetingPaused) props.resumeTimer();
          else props.startTimer(props.meeting, props.currentView);
        }}
      >
        <img
          src={isThisMeetingRunning ? stop : play}
          style={{ width: "15px" }}
          alt=""
        />{" "}
        {isThisMeetingRunning ? "Stop" : "Start"}
      </Button>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  timer: state.meetingTimer
});

const mapDispatchToProps = dispatch => ({
  startTimer: (meeting, currentView) => {
    dispatch(startMeetingTimer(meeting, currentView));
  },
  stopTimer: () => {
    dispatch(stopMeetingTimer());
  },
  resumeTimer: () => {
    dispatch(resumeMeetingTimer());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Timer);
