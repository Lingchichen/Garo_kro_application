import React, { Component } from "react";
import { connect } from "react-redux";
import { closeModal } from "ducks/Modals";
import { createParkingLotItem } from "ducks/MeetingParkingLots";
import { parseDate } from "utilities/dates";
import Button from "components/Button";

class ParkingLotModal extends Component {
  constructor(props) {
    super(props);
    this.originatorChanged = this.originatorChanged.bind(this);
    this.timeChanged = this.timeChanged.bind(this);
    this.noteChanged = this.noteChanged.bind(this);
    this.save = this.save.bind(this);
    this.state = {
      originator: (props.attendees.length && props.attendees[0].id) || null,
      time_alloted: 5,
      note: ""
    };
  }

  originatorChanged(e) {
    let newOriginator = parseInt(e.target.value, 10);
    this.setState({ originator: newOriginator });
  }

  timeChanged(e) {
    let newTime = parseInt(e.target.value, 10);
    this.setState({ time_alloted: newTime });
  }

  noteChanged(e) {
    let newNote = e.target.value;
    this.setState({ note: newNote });
  }

  save() {
    let newParkingLotItem = {
      meeting: this.props.meeting.id,
      originator: this.state.originator,
      notes: this.state.note,
      time_alloted: this.state.time_alloted
    };
    this.props.createParkingLotItem(this.props.apiToken, newParkingLotItem);
    this.props.close();
  }

  render() {
    let date = parseDate(this.props.meeting.date_time);
    let heading = `${
      this.props.meetingType.meeting_title
    } - ${date.fullMonthName.toUpperCase()} ${date.day}, ${date.year}`;

    return (
      <div className="kro-modal parking-lot-modal">
        <h3>Parking Lot entry for "{heading}"</h3>
        <div className="originator">
          Originator{" "}
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
        <div className="time-alloted-select">
          Time Alloted{" "}
          <select value={this.state.time_alloted} onChange={this.timeChanged}>
            {Array.from(Array(12).keys()).map(x => (
              <option key={x + 1} value={(x + 1) * 5}>
                {(x + 1) * 5} min
              </option>
            ))}
          </select>
        </div>
        <div className="note">
          Note <textarea value={this.state.note} onChange={this.noteChanged} />
        </div>
        <div className="buttons">
          <Button click={this.save}>Save</Button>
          <Button click={this.props.close}>Cancel</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let meeting = state.meetings.items.find(
    ({ id }) => id === ownProps.parameters.meeting_id
  );

  let meetingType = state.meetingTypes.items.find(
    ({ id }) => id === meeting.meeting_type
  );

  let attendees = state.meetingAttendance.items
    .filter(att => att.meeting === meeting.id)
    .map(att => state.people.items.find(({ id }) => id === att.person));

  let apiToken = state.apiToken.value;

  return {
    meeting,
    meetingType,
    attendees,
    apiToken
  };
};

const mapDispatchToProps = dispatch => ({
  close: () => {
    dispatch(closeModal());
  },
  createParkingLotItem: (token, newParkingLotItem) => {
    dispatch(createParkingLotItem(token, newParkingLotItem));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ParkingLotModal);
