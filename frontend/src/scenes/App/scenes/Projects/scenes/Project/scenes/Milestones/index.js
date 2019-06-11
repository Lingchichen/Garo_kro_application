import React from "react";
import { connect } from "react-redux";
import { Switch, Route, Link } from "react-router-dom";
import { getAbbMonthName } from "utilities/dates";
import Milestone from "./scenes/Milestone";
import TopGreyBar from "../../components/TopGreyBar";
import "./style.css";

const MilestoneListItem = props => {
  let dueDate = props.status.new_due_date.split("-");
  let dueDateStr = `${getAbbMonthName(parseInt(dueDate[1], 10) - 1)} ${
    dueDate[2]
  }, ${dueDate[0]}`;

  return (
    <tr>
      <td>
        <Link
          to={`/projects/${props.projectId}/milestones/${props.milestone.id}`}
        >
          {props.milestone.title}
        </Link>
      </td>
      <td>{props.statusStr}</td>
      <td>{props.status ? props.status.percent_complete + "%" : ""}</td>
      <td>{dueDateStr}</td>
      <td>{props.status ? props.status.new_budget : ""}</td>
    </tr>
  );
};

const mapStateToProps = (state, ownProps) => {
  let projectId = parseInt(ownProps.match.params.projectId, 10);
  let project = state.projects.items.find(({ id }) => id === projectId);

  let milestones = state.milestones.items.filter(
    ({ project }) => project === projectId
  );

  let milestoneStatuses = state.projectMilestoneDevelopmentStepStatuses.items.filter(
    s =>
      s.milestone && milestones.find(({ id }) => id === s.milestone)
        ? true
        : false
  );

  let statuses = state.statuses.items;

  return {
    milestones,
    projectId,
    milestoneStatuses,
    statuses,
    project
  };
};

const MilestonesList = connect(mapStateToProps)(props => {
  return (
    <div className="milestones-list">
      <h3 className="text-center">Project Milestones</h3>
      <TopGreyBar
        projectId={props.projectId}
        milestones={props.milestones.length}
        showMilestones={true}
        milestonesActive={true}
        history={props.history}
        showNewMilestone={true}
      />
      <div className="title">
        <div className="label">Project Title</div>
        <input
          type="text"
          value={props.project ? props.project.title : ""}
          disabled
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>% Complete</th>
            <th>Due Date</th>
            <th>Budget</th>
          </tr>
        </thead>
        <tbody>
          {props.milestones.map(milestone => {
            let milestoneStatuses = props.milestoneStatuses
              .filter(ms => ms.milestone === milestone.id)
              .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

            let currentStatus = milestoneStatuses.length
              ? milestoneStatuses[0]
              : null;

            let statusStr = "";
            if (currentStatus)
              statusStr = props.statuses.find(
                ({ id }) => id === currentStatus.status
              ).display_name;

            return (
              <MilestoneListItem
                key={milestone.id}
                milestone={milestone}
                status={currentStatus}
                statusStr={statusStr}
                projectId={props.projectId}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

const NewMilestone = props => <Milestone {...props} milestone={null} />;

const Milestones = props => (
  <div className="milestones">
    <Switch>
      <Route
        path={`/projects/:projectId/milestones/new`}
        component={NewMilestone}
      />
      <Route
        path={`/projects/:projectId/milestones/:milestoneId`}
        component={Milestone}
      />
      <Route
        path={`/projects/:projectId/milestones`}
        component={MilestonesList}
      />
    </Switch>
  </div>
);

export default Milestones;
