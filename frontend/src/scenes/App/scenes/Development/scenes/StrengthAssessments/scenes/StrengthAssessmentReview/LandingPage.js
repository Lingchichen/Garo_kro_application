import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Box from "components/Box";
import Button from "components/Button";
import meetingIcon from "images/meetingG.png";
import ManagerLoginForm from "../../../../containers/ManagerLoginForm";

const LandingPage = props => {
  let firstName = "";
  let lastName = "";
  let name = "";
  let position = "";
  let department = "";
  let employeeNum = "";
  let position_date = "";
  let reviewerPosition = "";
  let reviewerEmployeeNumber = "";
  let reviewDate = moment().format("MMMM Do, YYYY");

  if (props.manager) {
    reviewerEmployeeNumber = props.manager.employee_number;
  }

  if (props.managerJobDescription) {
    reviewerPosition = props.managerJobDescription.job_title;
  }

  if (props.personAssessed) {
    firstName = props.personAssessed.user.first_name;
    lastName = props.personAssessed.user.last_name;
    name = `${firstName} ${lastName}`;
    employeeNum = props.personAssessed.employee_number;
    position_date = moment(props.personAssessed.position_date).format(
      "MMMM Do, YYYY"
    );
  }

  if (props.jobDescription) {
    position = props.jobDescription.job_title;
  }

  if (props.companyDepartment) {
    department = props.companyDepartment.name;
  }

  return (
    <div className="landing-page">
      <h3 style={{ textAlign: "center" }}>
        EMPLOYEE STRENGTH ASSESSMENT REVIEW
        <Link to="/development" className="exit">&times;</Link>
      </h3>
      <Box className="person-assessed">
        <div className="header dark-lime">
          <img src={meetingIcon} alt="" /> {name}
        </div>
        <div className="body light-lime">
          <table>
            <tbody>
              <tr>
                <td>Position</td>
                <td>{position}</td>
              </tr>
              <tr>
                <td>Department</td>
                <td>{department}</td>
              </tr>
              <tr>
                <td>Employee #</td>
                <td>{employeeNum}</td>
              </tr>
              <tr>
                <td>Position start date</td>
                <td>{position_date}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Box>
      <Box className="reviewer">
        <div className="header dark-lime">
          <img src={meetingIcon} alt="" /> Reviewed By
        </div>
        <div className="body light-lime">
          {!props.manager && <ManagerLoginForm {...props} />}
          {props.manager && (
            <table>
              <tbody>
                <tr>
                  <td>Position</td>
                  <td>{reviewerPosition}</td>
                </tr>
                <tr>
                  <td>Employee #</td>
                  <td>{reviewerEmployeeNumber}</td>
                </tr>
                <tr>
                  <td>Review Date</td>
                  <td>{reviewDate}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </Box>
      <Box className="introduction">
        <div className="header dark-lime">
          <img src={meetingIcon} alt="" /> Introduction
        </div>
        <div className="body light-lime">
          This is an "open end" meeting. The meeting compares manager and
          employee results and discusses strengths and variances. The objective
          is to facilitate dialogue so both parties come away with a better
          understanding of employee strengths, company expectations and employee
          development plan.
        </div>
      </Box>
      <div className="buttons">
        {props.manager && (
          <Button click={props.begin}>BEGIN REVIEW</Button>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
