import React from 'react';
import { connect } from 'react-redux';
import home from 'images/homeB.png';
import analytics from 'images/indicatorsB.png';
import calendar from 'images/calendarB.png';
import meetings from 'images/meetingB.png';
import leadershipGrowth from 'images/leadership-growth.png';
import tools from 'images/toolsB.png';
import person from 'images/person.png';
import { logout } from 'ducks/ApiToken';
import { resetDefaultCompany } from 'ducks/DefaultCompany';
import { resetMeetingTimer } from 'ducks/MeetingTimer';
import { NavLink, withRouter } from 'react-router-dom';
import Button from 'components/Button';
import './style.css';

const SideBar = props => (
  <div className="side-bar">
    <NavLink exact to="/" className="icon home">
      <img src={home} alt="" />
      <div className="label">Home</div>
    </NavLink>
    <NavLink to="/analytics" className="icon analytics">
      <img src={analytics} alt="" />
      <div className="label">Analytics</div>
    </NavLink>
    <NavLink to="/calendar" className="icon calendar">
      <img src={calendar} alt="" />
      <div className="label">Calendar</div>
    </NavLink>
    <NavLink to="/meetings" className="icon meetings">
      <img src={meetings} alt="" />
      <div className="label">Meetings</div>
    </NavLink>
    <NavLink to="/development" className="icon development">
      <img src={leadershipGrowth} alt="" />
      <div className="label">Development</div>
    </NavLink>
    <NavLink to="/tools" className="icon tools">
      <img src={tools} alt="" />
      <div className="label">Tools</div>
    </NavLink>
    <div className="user-display">
      {props.picture?
        (<img src={props.picture} alt=""/>
          ):(<img src={person} alt="" />
        )
      }
      <div className="name">
        {props.first_name ? props.first_name.charAt(0) : ''}. {props.last_name}
      </div>
      <div className="title">{props.title}</div>
      <div className="logout" />
      <Button className="small-btn" click={props.logout}>
        Logout
      </Button>
    </div>
  </div>
);

const mapStateToProps = state => {
  let jobTitle = '';
  let jobDescription = state.jobDescriptions.items.find(
    ({ id }) => id === state.me.job_description
  );
  if (jobDescription) jobTitle = jobDescription.job_title;

  return {
    first_name: state.me.user.first_name,
    last_name: state.me.user.last_name,
    title: jobTitle,
    timer: state.meetingTimer,
    picture:state.me.picture_file

  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => {
    dispatch(logout());
    dispatch(resetDefaultCompany());
    dispatch(resetMeetingTimer());
  }
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SideBar)
);
