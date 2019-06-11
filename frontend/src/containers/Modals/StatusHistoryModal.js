import React from "react";
import { connect } from "react-redux";
import { closeModal } from "ducks/Modals";
import Button from "components/Button";
import { parseDate, getAbbMonthName } from "utilities/dates";

const StatusHistoryModal = props => {
  let { type } = props.parameters;
  return (
    <div className="kro-modal status-history-modal">
      <h3>{type} Status History</h3>
      <div className="title">
        <div className="label">{type}</div>
        <input type="text" value={props.title} disabled />
      </div>
      {props.objStatuses.length && (
        <table>
          <thead>
            <tr>
              <th>Date Updated</th>
              <th>Complete</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Budget</th>
              {/*<th>Change Reason</th>*/}
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {props.objStatuses.map(objStatus => {
              let status = props.statuses.find(
                ({ id }) => id === objStatus.status
              );
              let date = parseDate(objStatus.date);
              let dateStr = `${date.abbMonthName} ${date.day}, ${date.year}`;

              let dueDate = objStatus.new_due_date.split("-");
              let dueDateStr = `${getAbbMonthName(
                parseInt(dueDate[1], 10) - 1
              )} ${dueDate[2]}, ${dueDate[0]}`;
              return (
                <tr key={objStatus.id}>
                  <td>{dateStr}</td>
                  <td>{objStatus.percent_complete}%</td>
                  <td>{status.display_name}</td>
                  <td>{dueDateStr}</td>
                  <td>{objStatus.new_budget}</td>
                  {/*<td>{objStatus.change_reason}</td>*/}
                  <td className="comments">{objStatus.comments}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <div className="buttons">
        <Button
          click={() => {
            props.closeModal();
          }}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  let title = "";
  let obj = null;
  let objStatuses = [];
  let project = false;
  let milestone = false;
  let devStep = false;
  if (ownProps.parameters.project) {
    project = true;
    obj = state.projects.items.find(
      ({ id }) => id === ownProps.parameters.project
    );
  } else if (ownProps.parameters.milestone) {
    milestone = true;
    obj = state.milestones.items.find(
      ({ id }) => id === ownProps.parameters.milestone
    );
  } else if (ownProps.parameters.developmentStep) {
    devStep = true;
    obj = state.employeeDevelopmentPlanActionSteps.items.find(
      ({ id }) => id === ownProps.parameters.developmentStep
    );
  }

  if (obj) {
    title = devStep ? obj.action_step_description : obj.title;
    objStatuses = state.projectMilestoneDevelopmentStepStatuses.items
      .filter(status => (project ? status.project === obj.id : true))
      .filter(status => (milestone ? status.milestone === obj.id : true))
      .filter(status => (devStep ? status.development_plan_step === obj.id : true))
      .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  }

  return {
    title,
    statuses: state.statuses.items,
    objStatuses
  };
};

const mapDispatchToProps = dispatch => ({
  closeModal: () => {
    dispatch(closeModal());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StatusHistoryModal);
