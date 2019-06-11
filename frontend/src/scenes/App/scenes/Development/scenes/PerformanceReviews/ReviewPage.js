import React from "react";
import TopBar from "./TopBar";
import Button from "components/Button";
import { Link } from 'react-router-dom';
const ReviewPage = props => {
  let overall_performance="";
  let strengths="";
  let areas_for_further_development="";
  let challenges="";
  let employee_comments="";
  let completed=false;
  let overall_performance_msg='Overall performance field must not be empty'
  let strengths_msg='Strength field must not be empty'
  let areas_for_further_development_msg='Areas for further development field must not be empty'
  let challenges_msg='Challenges field must not be empty'
  let employee_comments_msg='Employee comments field must not be empty'
  overall_performance = props.overall_performance;
  strengths = props.strengths;
  areas_for_further_development =props.areas_for_further_development;
  challenges =props.challenges;
  employee_comments =props.employee_comments;
  completed=props.completed;

  return (
    <div className="question">
      <h3 style={{ textAlign: "center",fontSize:"30px"}}>
        EMPLOYEE PERFORMANCE REVIEW  <Link to={'/development/'}className="exit" >&times;</Link>
      </h3>

      <TopBar {...props} />
      <div className='comments'>
          <div className="statement">
            <div className='statement-header'>Overall Performance:</div>
            {props.overall_performance_error.map(error =>
                <div className="error-msg">{error}</div>
            )}
            <textarea  className={
                props.overall_performance_error.length
                  ? "error"
                  : ""
            } value={overall_performance}
            onChange={props.overallPerformanceChanged}  onBlur={props.saveComments}/>
          </div>
          <div className="statement">
            <div className='statement-header'>Strength:</div>
            {props.strengths_errors.map(error =>
                <div className="error-msg">{error}</div>
            )}
            <textarea className={
                props.strengths_errors.length
                  ? "error"
                  : ""
            } value={strengths} onChange={props.strengthsChanged}  onBlur={props.saveComments}/>
          </div>
          <div className="statement">
            <div className="statement-header">Areas for Further Development:</div>
            {props.areas_for_further_development_errors.map(error =>
                <div className="error-msg">{error}</div>
            )}
            <textarea className={
                props.areas_for_further_development_errors.length
                  ? "error"
                  : ""
            } value={areas_for_further_development} onChange={props.furtherDevelopmentChanged}  onBlur={props.saveComments}/>
          </div>
          <div className="statement">
            <div className="statement-header">Challenges:</div>
            {props.challenges_errors.map(error =>
                <div className="error-msg">{error}</div>
            )}
            <textarea className={
                props.challenges_errors.length
                  ? "error"
                  : ""
            } value={challenges} onChange={props.challengesChanged}  onBlur={props.saveComments}/>
          </div>
          <div className="statement">
            <div className="statement-header">Employee's Comments:</div>
            {props.employee_comments_errors.map(error =>
                <div className="error-msg">{error}</div>
            )}
            <textarea className={
                props.employee_comments_errors.length
                  ? "error"
                  : ""
            } rows="10" cols="50" value={employee_comments} onChange={props.employeeCommentsChanged}  onBlur={props.saveComments}/>
          </div>
      </div>

    </div>
  )
};

export default ReviewPage;
