import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'components/Button';
import MeetingsListItem from './components/MeetingsListItem';
import './style.css';
import future from 'images/future.png';
import past from 'images/past.png';

class MeetingsList extends Component {
  constructor(props) {
    super(props);
    this.ALL = 'ALL';
    this.meetingListItems = this.meetingListItems.bind(this);
    this.openMeeting = this.openMeeting.bind(this);
    this.byType = this.byType.bind(this);
    this.upcoming = this.upcoming.bind(this);
    this.completed = this.completed.bind(this);
    this.typeDropDownOptions = this.typeDropDownOptions.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.setCompleted = this.setCompleted.bind(this);
    this.unsetCompleted = this.unsetCompleted.bind(this);
    this.state = {
      openMeeting: null,
      filter: this.ALL,
      completed: false
    };
  }

  byType(meetings, type) {
    if (type !== this.ALL) return meetings.filter(m => m.meeting_type === type);
    return meetings;
  }

  upcoming(meetings) {
    return meetings.filter(m => Date.parse(m.date_time) > Date.now());
  }

  completed(meetings) {
    return meetings.filter(m => Date.parse(m.date_time) < Date.now());
  }

  openMeeting(id) {
    return () => {
      this.setState({ openMeeting: id });
    };
  }

  meetingListItems(meetings, meetingTypes, openMeeting, openFunc) {
    return meetings.map(meeting => (
      <MeetingsListItem
        key={meeting.id}
        meeting={meeting}
        opened={openMeeting === null ? false : openMeeting === meeting.id}
        open={this.openMeeting(meeting.id)}
        meetingType={
          meetingTypes.find(
            meetingType => meetingType.id === meeting.meeting_type
          ) || {}
        }
      />
    ));
  }

  setFilter(e) {
    if (e.target.value === this.ALL) this.setState({ filter: e.target.value });
    else this.setState({ filter: parseInt(e.target.value, 10) });
  }

  setCompleted() {
    this.setState({ completed: true });
  }

  unsetCompleted() {
    this.setState({ completed: false });
  }

  typeDropDownOptions(meetingTypes) {
    return meetingTypes.map(type => (
      <option key={type.id} value={type.id}>
        {type.meeting_title}
      </option>
    ));
  }

  render() {
    let meetingsList = this.props.meetings;
    if (this.state.completed) meetingsList = this.completed(meetingsList);
    else meetingsList = this.upcoming(meetingsList);
    meetingsList = this.byType(meetingsList, this.state.filter);
    return (
      <div>
        <h3 className="text-center">Meetings &amp; Huddles</h3>
        <div className="filters">
          <select onChange={this.setFilter}>
            <option value={this.ALL} default>
              Show all types
            </option>
            {this.typeDropDownOptions(this.props.meetingTypes)}
          </select>
          <div className="buttons">
            <Button
              click={this.unsetCompleted}
              className={this.state.completed ? '' : 'active'}
            >
              <img src={future} alt="" /> Upcoming
            </Button>
            <Button
              click={this.setCompleted}
              className={this.state.completed ? 'active' : ''}
            >
              <img src={past} alt="" /> Completed
            </Button>
          </div>
          <div className="clearfix" />
        </div>
        <ul className="meetings-list">
          {this.meetingListItems(
            meetingsList,
            this.props.meetingTypes,
            this.state.openMeeting,
            this.openMeeting
          )}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  let meetings = state.meetings.items;
  if (state.me.user.is_staff && state.defaultCompany)
    meetings = state.meetings.items.filter(
      meeting => meeting.company === state.defaultCompany
    );

  return {
    meetings,
    meetingTypes: state.meetingTypes.items
  };
};

export default connect(mapStateToProps)(MeetingsList);
