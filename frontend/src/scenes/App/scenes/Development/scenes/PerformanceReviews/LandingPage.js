import React from "react";
import moment from "moment";
import Box from "components/Box";
import Button from "components/Button";
import { Link } from 'react-router-dom';
import meetingIcon from "images/meetingG.png";
import TopBarReview from "./TopBarReview";
import ManagerLoginForm from "../../containers/ManagerLoginForm";

const LandingPage = props => {
  let firstName = "";
  let lastName = "";
  let name = "";
  let position = "";
  let companyDepartments = "";
  let employeeNum = "";
  let position_date = "";
  let reviewerName ="";
  let reviewerEmployeeNumber = "";
  let reviewDate = moment().format("MMMM Do, YYYY");
  //reviewer
  if (props.manager) {
    reviewerEmployeeNumber = props.manager.employee_number;
    reviewerName = props.manager.user.username;
  }
  //reviewee
  if (props.personAssessed) {
    firstName = props.personAssessed.user.first_name;
    lastName = props.personAssessed.user.last_name;
    name = `${firstName} ${lastName}`;
    position=props.personAssessed.position;

    employeeNum = props.personAssessed.employee_number;
    position_date = moment(props.personAssessed.position_date).format(
      "MMMM Do, YYYY"
    );
  }
  if (props.jobDescription) {
    position = props.jobDescription.job_title;

  }
 if(props.companyDepartments){
   companyDepartments=props.companyDepartments.name;
 }

  return (
    <div className="landing-page">
      <h3 style={{ textAlign: "center" ,marginBottom: "-2.5rem",fontSize:"30px"}}>
        EMPLOYEE PERFORMANCE REVIEW <Link to={'/development/'} className="exit">&times;</Link>
      </h3>
      <TopBarReview {...props} />
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
                <td>{companyDepartments}</td>
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
      <Box className="reviewer" style={{display: 'inline-block'}}>
        <div className="header dark-lime">
          <img src={meetingIcon} alt="" /> Reviewed By
        </div>
        <div className="body light-lime">
          {!props.manager && <ManagerLoginForm {...props} />}
          {props.manager && (
            <table>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>{reviewerName}</td>
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
          This is a performance review that will conclude the Employee Strength Assessment process. This review captures the
          development goals that both the employee and manager agree to and sign off on.
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
