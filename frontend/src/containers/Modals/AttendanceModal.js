import React, { Component } from "react";
import { connect } from "react-redux";
import { closeModal } from "ducks/Modals";
import { saveAttendance } from "ducks/MeetingAttendance";
import { parseDate } from "utilities/dates";
import Box from "components/Box";
import Button from "components/Button";
import arrow from "images/ArrowB.png";

class AttendanceModal extends Component {
  constructor(props) {
    super(props);
    this.DIRECTORY = "DIRECTORY";
    this.DEPARTMENT = "DEPARTMENT";
    this.EXTERNAL = "EXTERNAL";
    this.ATTENDEE = "ATTENDEE";
    this.FACILITATOR = "FACILITATOR";
    this.CHAIR = "CHAIR";
    this.peopleSelectionChanged = this.peopleSelectionChanged.bind(this);
    this.addAttendees = this.addAttendees.bind(this);
    this.removeAttendees = this.removeAttendees.bind(this);
    this.toggleAttendee = this.toggleAttendee.bind(this);
    this.changeDepartmentFilter = this.changeDepartmentFilter.bind(this);
    this.save = this.save.bind(this);
    this.state = {
      filter: this.DIRECTORY,
      role: this.ATTENDEE,
      selectedPeople: [],
      attendance: props.meetingAttendance.slice(),
      selectedAttendees: [],
      department: props.departments[0]
    };
  }

  setRole(role) {
    return () => {
      this.setState({ role });
    };
  }

  setFilter(filter) {
    return () => {
      this.setState({ filter });
    };
  }

  peopleSelectionChanged(e) {
    var options = e.target.options;
    var value = [];
    for (var i = 0; i < options.length; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    this.setState({ selectedPeople: value });
  }

  addAttendees() {
    this.setState({
      attendance: this.state.attendance.concat(
        this.state.selectedPeople.map(person => ({
          //id: null,
          person: parseInt(person, 10),
          meeting: this.props.meeting.id,
          role: this.state.role
        }))
      ),
      selectedPeople: [],
      selectedAttendees: []
    });
  }

  removeAttendees() {
    this.setState({
      attendance: this.state.attendance.filter(
        att => !this.state.selectedAttendees.find(sa => sa === att.person)
      )
    });
  }

  toggleAttendee(id) {
    return () => {
      let alreadySelected = this.state.selectedAttendees.find(
        att => att === id
      );
      if (alreadySelected) {
        this.setState({
          selectedAttendees: this.state.selectedAttendees.filter(
            att => att !== id
          )
        });
      } else {
        this.setState({
          selectedAttendees: this.state.selectedAttendees.concat([id])
        });
      }
    };
  }

  changeDepartmentFilter(e) {
    let d = parseInt(e.target.value, 10);
    this.setState({ department: d });
  }

  save() {
    this.props.save(
      this.props.token,
      this.props.meetingAttendance,
      this.state.attendance
    );
  }

  render() {
    let date = parseDate(this.props.meeting.date_time);
    let heading = `${
      this.props.meetingType.meeting_title
    } - ${date.fullMonthName.toUpperCase()} ${date.day}, ${date.year}`;

    return (
      <div className="kro-modal attendance">
        <h3>Attendance for "{heading}"</h3>
        <Box
          className={
            "attendance-from" +
            (this.state.filter === this.DEPARTMENT ? " department" : "")
          }
        >
          <div className="attendance-filters">
            <h5>Select Attendees by:</h5>
            <div
              className={
                "radio-button" +
                (this.state.filter === this.DIRECTORY ? " active" : "")
              }
              onClick={this.setFilter(this.DIRECTORY)}
            />{" "}
            Staff Directory<br />
            <div
              className={
                "radio-button" +
                (this.state.filter === this.DEPARTMENT ? " active" : "")
              }
              onClick={this.setFilter(this.DEPARTMENT)}
            />{" "}
            Department<br />
            {this.state.filter === this.DEPARTMENT && (
              <div>
                <select
                  onChange={this.changeDepartmentFilter}
                  value={this.state.department}
                >
                  {this.props.departments.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div
              className={
                "radio-button" +
                (this.state.filter === this.EXTERNAL ? " active" : "")
              }
              onClick={this.setFilter(this.EXTERNAL)}
            />{" "}
            3<sup>rd</sup> Party
          </div>
          <div className="attendance-select">
            <h5>Select Attendees</h5>
            <select
              multiple
              value={this.state.selectedPeople}
              onChange={this.peopleSelectionChanged}
            >
              {this.props.people
                .filter(
                  ({ id }) =>
                    this.state.attendance.find(({ person }) => person === id)
                      ? false
                      : true
                )
                .filter(({ job_description }) => {
                  if (this.state.filter !== this.DEPARTMENT) return true;
                  let jd = this.props.jobDescriptions.find(
                    ({ id }) => id === job_description
                  );
                  if (jd.company_department === this.state.department)
                    return true;
                  return false;
                })
                .filter(({ is_third_party }) => {
                  if (this.state.filter !== this.EXTERNAL) return true;
                  return is_third_party;
                })
                .sort((a, b) => {
                  if (a.user.last_name < b.user.last_name) return -1;
                  if (a.user.last_name > b.user.last_name) return 1;
                  return 0;
                })
                .map(person => (
                  <option value={person.id} key={person.id}>
                    {person.user.first_name + " " + person.user.last_name}
                  </option>
                ))}
            </select>
          </div>
          <div className="attendance-roles">
            <div
              className={
                "radio-button" +
                (this.state.role === this.ATTENDEE ? " active" : "")
              }
              onClick={this.setRole(this.ATTENDEE)}
            />{" "}
            Attendee<br />
            <div
              className={
                "radio-button" +
                (this.state.role === this.FACILITATOR ? " active" : "")
              }
              onClick={this.setRole(this.FACILITATOR)}
            />{" "}
            Facilitator<br />
            <div
              className={
                "radio-button" +
                (this.state.role === this.CHAIR ? " active" : "")
              }
              onClick={this.setRole(this.CHAIR)}
            />{" "}
            Meeting Chair
          </div>
        </Box>
        <div className="add-remove">
          <img className="add" src={arrow} alt="" onClick={this.addAttendees} />
          <img
            className="remove"
            src={arrow}
            alt=""
            onClick={this.removeAttendees}
          />
        </div>
        <Box className="attendance-to">
          <h5>Meeting Attendance</h5>
          <table className="attendance-table">
            <tbody>
              {this.state.attendance.map(att => {
                let person = this.props.people.find(
                  ({ id }) => id === att.person
                );

                let name = person.user.first_name + " " + person.user.last_name;

                let jobDescription = this.props.jobDescriptions.find(
                  ({ id }) => id === person.job_description
                );

                let title = jobDescription.job_title;

                return (
                  <tr
                    key={person.id}
                    className={
                      this.state.selectedAttendees.find(
                        att => att === person.id
                      )
                        ? "selected"
                        : ""
                    }
                    onClick={this.toggleAttendee(person.id)}
                  >
                    <td className="name">{name}</td>
                    <td className="title">{title}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
        <div className="clearfix" />
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

  let meetingAttendance = state.meetingAttendance.items.filter(
    ({ meeting }) => meeting === ownProps.parameters.meeting_id
  );

  let meetingType = state.meetingTypes.items.find(
    ({ id }) => id === meeting.meeting_type
  );

  let people = state.people.items.filter(
    ({ company }) => company === meeting.company
  );

  let jobDescriptions = state.jobDescriptions.items;

  let departments = state.companyDepartments.items.filter(
    d => d.company === meeting.company
  );

  let token = state.apiToken.value;

  return {
    meeting,
    meetingAttendance,
    meetingType,
    people,
    jobDescriptions,
    departments,
    token
  };
};

const mapDispatchToProps = dispatch => ({
  close: () => {
    dispatch(closeModal());
  },
  save: (token, currentAttendance, newAttendance) => {
    dispatch(saveAttendance(token, currentAttendance, newAttendance));
    dispatch(closeModal());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AttendanceModal);
