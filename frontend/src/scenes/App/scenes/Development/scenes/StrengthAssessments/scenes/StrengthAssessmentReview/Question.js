import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import {XYPlot, LineSeries, VerticalGridLines, XAxis, YAxis} from 'react-vis';
import Button from "components/Button";
import TopBar from "./TopBar";
import 'react-vis/dist/style.css';

//functions for mathy stuff
const dateDesc = (a, b) => moment(b.review_period_to).diff(a.review_period_to);
const byRequest = req => a => a.assessment_request === req.id;
const isPersonAssessed = pa => a => a.assessed_by_person === pa.id;
const isNotPersonAssessed = pa => a => !isPersonAssessed(pa)(a);
const isForValueQuestion = q => v => v.value === q.value;
const notForAssessment = a => v => v.strength_assessment !== a.id;
const valueAnswer = (q, a) => v =>
  v.strength_assessment === a.id && isForValueQuestion(q)(v);
const isForRequest = (r, aa) => v =>
  aa.find(({ id }) => id === v.strength_assessment).assessment_request === r.id;
const isForPerson = (p, aa) => v =>
  aa.find(({ id }) => id === v.strength_assessment).assessed_by_person === p.id;
const isNotForPerson = (p, aa) => v => !isForPerson(p, aa)(v);
const devAnswer = q => a => {
  if (q.development === "SKILL") return a.development_skill;
  if (q.development === "KNOWLEDGE") return a.development_knowledge;
  if (q.development === "PASSION") return a.development_passion;
  if (q.development === "WISDOM") return a.development_wisdom;
  return 0;
};

const Question = props => {
  let question = props.questions[props.currentQuestion];
  let allReqs = props.allRequests.sort(dateDesc);
  let currentReq = allReqs[0];
  let prevReq = allReqs[1];

  let currentAss = props.allAssessments.filter(byRequest(currentReq));
  let prevAss = props.allAssessments.filter(byRequest(prevReq));

  let ipa = isPersonAssessed(props.personAssessed);
  let inpa = isNotPersonAssessed(props.personAssessed);
  let allTheirs = props.allAssessments.filter(ipa);
  let allPeers = props.allAssessments.filter(inpa);
  let currentTheirs = currentAss.find(ipa);
  let prevTheirs = prevAss.find(ipa);
  let currentPeers = currentAss.filter(inpa);
  let prevPeers = prevAss.filter(inpa);

  let allVals = props.allAssessmentValues;
  let currentTheirAns = 0;
  let currentAvgPeers = 0;
  let currentVariance = 0;
  let prevTheirAns = 0;
  let prevAvgPeers = 0;
  let prevVariance = 0;
  let hisTheirAns = 0;
  let hisPeerAns = 0;
  let hisVariance = 0;
  let sav = null;
  let pvs = null;

  //Current
  if (question.value) {
    sav = allVals.find(valueAnswer(question, currentTheirs));
    if (sav) currentTheirAns = sav.value_score;
    pvs = allVals
      .filter(isForValueQuestion(question))
      .filter(notForAssessment(currentTheirs))
      .filter(isForRequest(currentReq, props.allAssessments))
      .map(sav => sav.value_score);
  } else {
    currentTheirAns = devAnswer(question)(currentTheirs);
    pvs = currentPeers.map(devAnswer(question));
  }
  let sum = pvs.reduce((acc, v) => acc + v, 0);
  currentAvgPeers = Math.round(sum / pvs.length);
  currentVariance = currentAvgPeers - currentTheirAns;

  //Previous
  sav = null;
  if (question.value) {
    sav = allVals.find(valueAnswer(question, prevTheirs));
    if (sav) prevTheirAns = sav.value_score;
    pvs = allVals
      .filter(isForValueQuestion(question))
      .filter(notForAssessment(prevTheirs))
      .filter(isForRequest(prevReq, props.allAssessments))
      .map(sav => sav.value_score);
  } else{
    prevTheirAns = devAnswer(question)(prevTheirs);
    pvs = prevPeers.map(devAnswer(question));
  }
  let sumPrev = pvs.reduce((acc, v) => acc + v, 0);
  prevAvgPeers = Math.round(sumPrev / pvs.length);
  prevVariance = prevAvgPeers - prevTheirAns;

  //Historic
  sav = null;
  if (question.value) {
    sav = allVals
      .filter(isForValueQuestion(question))
      .filter(isForPerson(props.personAssessed, props.allAssessments))
      .map(sav => sav.value_score);
    pvs = allVals
      .filter(isForValueQuestion(question))
      .filter(isNotForPerson(props.personAssessed, props.allAssessments))
      .map(sav => sav.value_score);
  } else {
    sav = allTheirs.map(devAnswer(question));
    pvs = allPeers.map(devAnswer(question));
  }
  let sumHis = sav.reduce((acc, v) => acc + v, 0);
  hisTheirAns = Math.round(sumHis / sav.length);
  let sumPeerHis = pvs.reduce((acc, v) => acc + v, 0);
  hisPeerAns = Math.round(sumPeerHis / pvs.length);
  hisVariance = hisPeerAns - hisTheirAns;

  let completedWidth =
    (props.currentQuestion + 1) / props.questions.length * 100;

  let theirData = [
    {x: 0, y: hisTheirAns},
    {x: 1, y: prevTheirAns},
    {x: 2, y: currentTheirAns}
  ];

  let peerData = [
    {x: 0, y: hisPeerAns},
    {x: 1, y: prevAvgPeers},
    {x: 2, y: currentAvgPeers}
  ];

  return (
    <div className="question">
      <h3 style={{ textAlign: "center" }}>
        EMPLOYEE STRENGTH ASSESSMENT REVIEW
        <Link to="/development" className="exit">&times;</Link>
      </h3>
      <TopBar {...props} />
      <div className="question-body">
        <div className="detail">
          <div className="statement">
            <div className="statement-header">Question</div>
            <div className="content">{question.statement}</div>
          </div>
          <div className="assessments">
            <table>
              <thead>
                <tr>
                  <td />
                  <td>
                    Your<br />Answer
                  </td>
                  <td>
                    Your Peers<br />Avg. Answer
                  </td>
                  <td>Variance</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div>Current</div>
                  </td>
                  <td>
                    <div className="circle">{currentTheirAns}</div>
                  </td>
                  <td>
                    <div className="circle">{currentAvgPeers}</div>
                  </td>
                  <td>
                    <div className={`variance${currentVariance < 0 ? " negative" : ""}`}>{`${currentVariance > 0 ? "+" : ""}${currentVariance}`}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>Previous</div>
                  </td>
                  <td>
                    <div className="circle">{prevTheirAns}</div>
                  </td>
                  <td>
                    <div className="circle">{prevAvgPeers}</div>
                  </td>
                  <td>
                    <div className={`variance${prevVariance < 0 ? " negative" : ""}`}>{`${prevVariance > 0 ? "+" : ""}${prevVariance}`}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>
                      Historic Avg.
                    </div>
                  </td>
                  <td>
                    <div className="circle">{hisTheirAns}</div>
                  </td>
                  <td>
                    <div className="circle">{hisPeerAns}</div>
                  </td>
                  <td>
                    <div className={`variance${hisVariance < 0 ? " negative" : ""}`}>{`${hisVariance > 0 ? "+" : ""}${hisVariance}`}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="graph">
          <XYPlot height={300} width={300} margin={{right: 20}} yDomain={[1, 9]} animation>
            <VerticalGridLines tickValues={[0,1,2]} />
            <XAxis
              tickValues={[0,1,2]}
              tickFormat={(t, i) => {
                if (t === 0) return "Historic";
                if (t === 1) return "Previous";
                if (t === 2) return "Current";
                return t;
              }}
            />
            <YAxis tickValues={[1,2,3,4,5,6,7,8,9]} />
            <LineSeries data={theirData} color="#1979c5" />
            <LineSeries data={peerData} color="#703dc4" />
          </XYPlot>
        </div>
      </div>
      <div className="question-nav">
        <div>
          <Button className="small-btn" click={props.previous}>
            PREVIOUS
          </Button>
        </div>
        <div className="progress">
          <div
            className="progress-bar"
            style={{ width: `${completedWidth}%` }}
          />
        </div>
        <div>
          <Button className="small-btn" click={props.next}>
            NEXT
          </Button>
        </div>
      </div>
      <div className="question-counter">
        Question {props.currentQuestion + 1} of {props.questions.length}
      </div>
    </div>
  );
};

export default Question;
