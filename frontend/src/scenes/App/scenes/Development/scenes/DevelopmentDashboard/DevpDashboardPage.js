import React from "react";
import TopBar from "./TopBar";
import Box from "components/Box";
import Button from "components/Button";
import meetingIcon from "images/meetingG.png";
import "./style.css";
import moment from "moment";
import { Link } from 'react-router-dom'

const DevelopmentDashboard = props => {

  return (
    <div className="devPlan">
      <h3 style={{ textAlign: "center" ,fontSize:"28px"}}>
        My Development Dashboard
      </h3>
      <TopBar {...props} />
      <table className="table_box">
        <tbody>
        <tr>
          <td>
            <Box className="person-assessed-1">
              <div className="header dark-lime" style={{borderRadius:'10px'}}>
                <img src={meetingIcon} alt="" /> <label id='myHeader'>Current Development Plan Action Steps</label>
              </div>
              <Box className='inside-box-1'>
              <div style={{backgroundColor:'light-lime'}}>

                <table className="table_1">
                  <tbody>
                    <tr>
                      <th style={{width:'200px'}}>Development Action steps</th>
                      <th style={{width:'200px'}}>Completion Date</th>
                    </tr>

                    {props.actionSteps.map(actionStep=>(
                          <tr key={actionStep.id}>
                          <td>{actionStep.action_step_description}</td>

                          <td>{moment(actionStep.stepStatus.date).format(
                            "MMMM Do, YYYY")}</td>
                          </tr>

                    ))}



                  </tbody>
                </table>
              </div>
            </Box>
            </Box>
          </td>
          <td>
            <Box className="person-assessed-2" >
              <div className="header dark-lime" style={{borderRadius:'10px'}}>
                <img src={meetingIcon} alt="" /> Start New
              </div>
              <div className='section-2'style={{backgroundColor:'light-lime'}}>

                <Link to={'/development/performance-reviews/'+props.personId}><Button className={props.JobDesPage ? " active" : ""}>PERFORMANCE REVIEW</Button></Link>

                <Link to={'/development/strength-assessments/review/'+props.assessmentRequest}><Button className={props.JobDesPage ? " active" : ""} >STRENGTH ASSESMENT REVIEW</Button></Link>

                <Link to={'/development/development-plan-review/'+props.personId}><Button className={props.JobDesPage ? " active" : ""} >DEVELOPMENT PLAN REVIEW</Button></Link>

              </div>
            </Box>
          </td>
        </tr>
        <tr>
          <td>
            <Box className="person-assessed-3" style={{marginLeft: "10px"}}>
              <div className="header dark-lime"style={{borderRadius:'10px'}}>
                <img src={meetingIcon} alt="" /><label>History of Assessments and Reviews</label>
              </div>
              <div style={{backgroundColor:'light-lime'}}>
                <Box className="inside-box-2">
                <div style={{backgroundColor:'light-lime'}}>
                <table>
                  <tbody>
                    {props.historyReviews.map(review=>(
                      <tr key={review.id} style={{marginBottom:'3px'}}>
                        <td className="text"><div style={{fontWeight:'bold',width:'200px',textAlign:'left',fontSize:'16px'}}>{review.reviewType}</div><div style={{textAlign:'left',marginLeft:'10px'}}>  {moment(review.reviewDate).format(
                          "MMMM Do, YYYY")}</div></td>
                        <td><Button className={`small-btn${props.JobDesPage ? " active" : ""}`} click={props.performanceReviewClicked}>View</Button></td>
                      </tr>
                    ))}

                  </tbody>
                </table>
                </div>
                </Box>
              </div>
            </Box>
          </td>
          <td>
            <Box className="person-assessed-4">
              <div className="header dark-lime" style={{borderRadius:'10px'}}>
                <img src={meetingIcon} alt="" />Successes
              </div>

              <Box className="inside-box-4">
              <table>
                <tbody>
                
                {props.successList.map(ms=>
                <tr key={ms.id} style={{marginBottom:'3px'}}>
                  <td className="text"  style={{marginRight:"45px"}} >

                    <td style={{fontWeight:'bold',width:'200px',textAlign:'left',fontSize:'16px'}}>{moment(ms.date_time).format( "MMMM Do, YYYY")}</td>
                    <div style={{fontSize:'13px',textAlign:'left',borderBottom:'1px solid #a6ce39'}}>{ms.description}</div></td>
                </tr>

                )}


                
                </tbody>
                </table>
                </Box>
                <Button className={`small-btn${props.JobDesPage ? " active" : ""}`} click={props.performanceReviewClicked}>Browse</Button>
            </Box>
          </td>
        </tr>
        </tbody>
      </table>
  </div>
  );

};

export default DevelopmentDashboard;
