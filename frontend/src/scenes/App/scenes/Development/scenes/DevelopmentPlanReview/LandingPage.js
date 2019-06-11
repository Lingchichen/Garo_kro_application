import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Box from "components/Box";
import Button from "components/Button";
import meetingIcon from "images/meetingG.png";
import ManagerLoginForm from "../../containers/ManagerLoginForm";

const LandingPage = props => {
  let name = "";
  let position = "";
  let department = "";
  let employeeNum = "";
  let position_date = "";
  let reviewerEmployeeNumber = "";
  let reviewerPosition = "";
  let reviewDate = moment().format("MMMM Do, YYYY");
  let companyName = "";

  if (props.manager) {
    reviewerEmployeeNumber = props.manager.employee_number;
    reviewerPosition = props.managerJobDescription.job_title;
  }

  if (props.personAssessed) {
    let firstName = props.personAssessed.user.first_name;
    let lastName = props.personAssessed.user.last_name;
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

  if(props.company){
      companyName = props.company.name;
  }

  return (
    <div className="landing-page">
      <h3 style={{ textAlign: "center" }}>EMPLOYEE DEVELOPMENT PLAN REVIEW
        <Link to="/development" className="exit">&times;</Link>
      </h3>
      <Box className="person-assessed">
        <div className="header dark-lime"><img src={meetingIcon} alt="" /> {name}</div>
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
        <div className="header dark-lime"><img src={meetingIcon} alt="" /> Manager</div>
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
        <div className="header dark-lime"><img src={meetingIcon} alt="" /> Introduction</div>
        <div className="body light-lime">
          Completing your Development Plan involves both you and your manager.
          You are responsible for creating and implementing your Development
          Plan and for setting up a meeting(s) with your manager to discuss your
          developmental needs and for identifying what support and resources you
          may need.<br />Be sure to share with your manager your thoughts and
          suggestions about areas for improvement, goals and career paths – for
          your current job and your future opportunities at {companyName}<br />This will
          ensure both you and your manager have a common understanding of your
          thoughts and ideas regarding your development.<br />Although draft
          plans may be used to support your discussion meetings, you and your
          manager must mutually agree on the final Development Plan.
        </div>
      </Box>
      <div className="buttons">
        {props.manager && (
          <Button className="small-btn" click={props.begin}>Begin Development Plan Review</Button>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
