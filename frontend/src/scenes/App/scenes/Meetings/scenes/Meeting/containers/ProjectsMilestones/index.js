import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Button from "components/Button";
import projectsIcon from "images/projectG.png";
import arrow from "images/ArrowB.png";
import stallAlert from "images/StallAlert.png";

import "./style.css";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

const formatDueDate = dateStr => {
  let parts = dateStr.match(/(\d+)/g);
  let dueDate = new Date(parts[0], parts[1] - 1, parts[2]);
  let dueDateStr = `Due ${
    MONTHS[dueDate.getMonth()]
  } ${dueDate.getDate()}, ${dueDate.getFullYear()}`;
  return dueDateStr;
};

const Milestone = props => {
  let { milestone, statuses } = props;
  let milestoneStatuses =
    statuses.filter(s => s.milestone === milestone.id) || null;
  let sortedStatuses =
    milestoneStatuses.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) ||
    null;
  let currentStatus = sortedStatuses[0] || null;
  let dueDateStr = "";
  let pastDue = false;
  if (currentStatus) {
    dueDateStr = formatDueDate(currentStatus.new_due_date);
    dueDateStr += ` - ${currentStatus.percent_complete}%`;

    pastDue = new Date(currentStatus.new_due_date).getTime() < Date.now();
  }

  return (
    <li className="milestone">
      <div className="title">{milestone.title}</div>
      <div className={"due-date" + (pastDue ? " past-due" : "")}>
        {dueDateStr}{" "}
        {milestone.stall_alert && (
          <img className="stall-alert" src={stallAlert} alt="" />
        )}
      </div>
      <div className="arrow">
        <Link to={`/projects/${milestone.project}/milestones/${milestone.id}`}>
          <img src={arrow} alt="" />
        </Link>
      </div>
    </li>
  );
};

const Project = props => {
  let { project, statuses, milestones } = props;
  let projectStatuses = statuses.filter(s => s.project === project.id) || null;
  let sortedStatuses =
    projectStatuses.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) ||
    null;
  let currentStatus = sortedStatuses[0] || null;
  let dueDateStr = "";
  let pastDue = false;
  if (currentStatus) {
    dueDateStr = formatDueDate(currentStatus.new_due_date);
    dueDateStr += ` - ${currentStatus.percent_complete}%`;

    pastDue = new Date(currentStatus.new_due_date).getTime() < Date.now();
  }

  let projectMilestones = milestones.filter(m => m.project === project.id);

  return (
    <li className="project">
      <div className="title">{project.title}</div>
      <div className={"due-date" + (pastDue ? " past-due" : "")}>
        {dueDateStr}
        {project.stall_alert && (
          <img className="stall-alert" src={stallAlert} alt="" />
        )}
      </div>
      <div className="arrow">
        <Link to={`/projects/${project.id}`}>
          <img src={arrow} alt="" />
        </Link>
      </div>
      {projectMilestones.length ? (
        <ul className="milestones">
          {projectMilestones.map(milestone => (
            <Milestone key={milestone.id} {...props} milestone={milestone} />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

const ProjectsMilestones = props => (
  <div className="box meeting-sidebar meeting-projects">
    <div className="header">
      <img src={projectsIcon} alt="" /> Projects &amp; Milestones
    </div>
    {props.projects.length > 0 && (
      <ul>
        {props.projects.map(project => (
          <Project key={project.id} {...props} project={project} />
        ))}
      </ul>
    )}
    <Link to={`/projects/new/meeting/${props.meeting.id}`}>
      <Button>New Project</Button>
    </Link>
  </div>
);

const mapStateToProps = (state, ownProps) => {
  let meeting = null;
  let projects = null;
  let milestones = null;
  let statuses = null;
  meeting = state.meetings.items.find(m => m.id === ownProps.meeting);
  if (meeting)
    projects = state.projects.items.filter(
      p => p.meeting === meeting.id /*|| p.company === meeting.company*/
    );
  if (meeting && projects)
    milestones = state.milestones.items.filter(
      m => (projects.find(p => m.project === p.id) ? true : false)
    );
  if (meeting && projects && milestones)
    statuses = state.projectMilestoneDevelopmentStepStatuses.items.filter(
      s =>
        s.meeting === meeting.id ||
        projects.find(p => s.project === p.id) ||
        milestones.find(m => s.milestone === m.id)
          ? true
          : false
    );
  if (meeting && projects && milestones && statuses)
    return {
      meeting,
      projects,
      milestones,
      statuses
    };
  else return null;
};

export default connect(mapStateToProps, null)(ProjectsMilestones);
