import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { saveAssessment } from "ducks/StrengthAssessments";
import { saveStrengthAssessmentValues } from "ducks/StrengthAssessmentValues";
import { setAssessmentRequestPersonCompleted } from "ducks/AssessmentRequestPeople";
import Box from "components/Box";
import Button from "components/Button";
import meetingIcon from "images/meetingG.png";
import personIcon from "images/person.png";
import "./style.css";

const LandingPage = props => {
  let name = "",
    job_title = "",
    department = "",
    employee_num = "",
    position_date = "",
    period_from = "",
    period_to = "";

  if (props.assessmentRequest) {
    period_from = moment(props.assessmentRequest.review_period_from).format(
      "MMM DD, YYYY"
    );
    period_to = moment(props.assessmentRequest.review_period_to).format(
      "MMM DD, YYYY"
    );
  }

  if (props.person) {
    let { first_name, last_name } = props.person.user;
    name = `${first_name} ${last_name}`;
    employee_num = props.person.employee_number;
    position_date = moment(props.person.position_date).format("MMM DD, YYYY");
  }

  if (props.job_description) job_title = props.job_description.job_title;

  if (props.company_department) department = props.company_department.name;

  let company_name = "";
  if (props.company) company_name = props.company.name;

  return (
    <div className="strength-assessment">
      <h3 style={{ textAlign: "center" }}>Employee Strength Assessment</h3>
      <Box className="person-assessed">
        <div className="header dark-lime">
          <img src={meetingIcon} alt="" />
          {name}
        </div>
        <div className="body light-lime">
          <table>
            <tbody>
              <tr>
                <td>Position</td>
                <td>{job_title}</td>
              </tr>
              <tr>
                <td>Department</td>
                <td>{department}</td>
              </tr>
              <tr>
                <td>Employee #</td>
                <td>{employee_num}</td>
              </tr>
              <tr>
                <td>Position start date</td>
                <td>{position_date}</td>
              </tr>
              <tr>
                <td>Period From</td>
                <td>{period_from}</td>
              </tr>
              <tr>
                <td>Period To</td>
                <td>{period_to}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Box>
      <Box className="introduction">
        <div className="header dark-lime">
          <img src={meetingIcon} alt="" />Introduction
        </div>
        <div className="body light-lime">
          {`This Employee Strength Assessment tool is to better align the
          strengths of employees with ${company_name}. This assessment tool
          will be given to both the employee and manager. It will asks a series
          of general questions that will prompt a response. Employee and manager
          responses will be compared for identifying strengths and aligning
          variances. The purpose is for employees to align with
          ${company_name}'s values. The tool brings about awareness, prompts
          dialogue and builds team rapport.`}
        </div>
      </Box>
      <Box className="how-to-perform">
        <div className="header dark-lime">
          <img src={meetingIcon} alt="" />How to perform the assessment
        </div>
        <div className="body light-lime">
          {`Compare your actions and behaviours to ${company_name}'s values by
          selecting the number which you feel most accurately reflects your
          score. There are sub-headers that clarify ${company_name}’s core
          values. Your manager will use the same assessment to evaluate your
          performance. Variances will be clarified in a follow up meeting.`}
        </div>
      </Box>
      <div className="buttons">
        <Button click={props.begin}>BEGIN ASSESSMENT</Button>
      </div>
    </div>
  );
};

const CommentsPage = props => {
  let name = "",
    job_title = "";

  if (props.person) {
    let { first_name, last_name } = props.person.user;
    name = `${first_name} ${last_name}`;
  }

  if (props.job_description) job_title = props.job_description.job_title;

  let questionCount = props.questionCount + 1;
  let completedQuestions = props.questionCount;
  let completedWidth = completedQuestions / questionCount * 100;
  return (
    <div className="strength-assessment-question">
      <Box className="person">
        {props.person.picture_file && (
          <img src={props.person.picture_file} alt="" />
        )}
        {!props.person.picture_file && <img src={personIcon} alt="" />}
        {name}
        <br />
        <span className="job-title">{job_title}</span>
      </Box>
      <h4>EMPLOYEE STRENGTH ASSESSMENT</h4>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${completedWidth}%` }} />
      </div>
      <div className="question-counter">
        Question {props.questionCount + 1} of {questionCount}
      </div>
      <div className="statement">
        Please enter any additional comments below then complete your assessment
        at the bottom.
      </div>
      <div className="comments">
        <textarea
          value={props.comments}
          onChange={e => {
            props.commentsChanged(e.target.value);
          }}
        />
      </div>
      <div className="buttons" style={{ marginTop: "30px" }}>
        <Button click={props.back}>Previous Question</Button>
        <Button click={props.completeAssessment}>Complete Assessment</Button>
      </div>
    </div>
  );
};

const CompletedPage = props => {
  return (
    <div className="strength-assessment">
      <h3 style={{ textAlign: "center" }}>Employee Strength Assessment</h3>
      <h4>Thank you, your assessment has been completed.</h4>
      <div className="buttons">
        <Button
          click={() => {
            props.history.push("/");
          }}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

const Question = props => {
  let name = "",
    job_title = "";

  let question = props.questions[props.questionIndex];

  if (props.person) {
    let { first_name, last_name } = props.person.user;
    name = `${first_name} ${last_name}`;
  }

  if (props.job_description) job_title = props.job_description.job_title;

  let questionCount = props.questions.length + 1;
  let completedQuestions = props.questions.reduce(
    (acc, v) => (v.completed ? acc + 1 : acc),
    0
  );
  let completedWidth = completedQuestions / questionCount * 100;

  let showBack = false;
  let showNext = false;
  if (completedQuestions) showBack = true;
  if (question.completed) showNext = true;

  let statement_text = question.statement.replace(
    /<company_name>/g,
    props.company.name
  );

  return (
    <div className="strength-assessment-question">
      <Box className="person">
        {props.person.picture_file && (
          <img src={props.person.picture_file} alt="" />
        )}
        {!props.person.picture_file && <img src={personIcon} alt="" />}
        {name}
        <br />
        <span className="job-title">{job_title}</span>
      </Box>
      <h4>EMPLOYEE STRENGTH ASSESSMENT</h4>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${completedWidth}%` }} />
      </div>
      <div className="question-counter">
        Question {props.questionIndex + 1} of {questionCount}
      </div>
      <div className="statement">{statement_text}</div>
      <div className="scores">
        {[...Array(9).keys()].map(i => (
          <div
            key={i}
            className={`score${question.score === i + 1 ? " selected" : ""}`}
            onClick={() => {
              props.setScore(i + 1);
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <div className="buttons">
        {showBack && <Button click={props.back}>Previous Question</Button>}
        {showNext && <Button click={props.next}>Next Question</Button>}
      </div>
    </div>
  );
};

class StrengthAssessment extends Component {
  constructor(props) {
    super(props);
    this.begin = this.begin.bind(this);
    this.previousQuestion = this.previousQuestion.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.setScore = this.setScore.bind(this);
    this.commentsChanged = this.commentsChanged.bind(this);
    this.completeAssessment = this.completeAssessment.bind(this);
    this.assessmentSaved = this.assessmentSaved.bind(this);
    this.finished = this.finished.bind(this);
    this.state = {
      startTime: moment().format(),
      landingPage: true,
      commentsPage: false,
      currentQuestion: 0,
      questions: [],
      comments: "",
      completed: false
    };

    this.state.questions = props.values.map(v => ({
      value: v.id,
      statement: v.statement,
      score: 0,
      completed: false
    }));

    //Fisher-Yates Shuffle (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm)
    for (let i = this.state.questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.state.questions[i], this.state.questions[j]] = [
        this.state.questions[j],
        this.state.questions[i]
      ];
    }

    this.state.questions = this.state.questions.concat([
      {
        statement:
          "I produce quality work that is valued by customers, peers, supervisors, and <company_name>",
        score: 0,
        completed: false
      },
      {
        statement:
          "I value staying current and understand that it is part of my future success at <company_name>",
        score: 0,
        completed: false
      },
      {
        statement: "PASSION",
        score: 0,
        completed: false
      },
      {
        statement: "WISDOM",
        score: 0,
        completed: false
      }
    ]);
  }

  begin() {
    this.setState({ landingPage: false, currentQuestion: 0 });
  }

  previousQuestion(currentQuestion) {
    return () => {
      if (this.state.commentsPage) this.setState({ commentsPage: false });
      else if (currentQuestion === 0) this.setState({ landingPage: true });
      else this.setState({ currentQuestion: currentQuestion - 1 });
    };
  }

  nextQuestion(currentQuestion) {
    return () => {
      if (currentQuestion === this.state.questions.length - 1)
        this.setState({ commentsPage: true });
      else this.setState({ currentQuestion: currentQuestion + 1 });
    };
  }

  setScore(currentQuestion) {
    return score => {
      let questions = this.state.questions.slice();
      let question = questions[currentQuestion];
      question.score = score;
      question.completed = true;
      let nextQuestion =
        currentQuestion === questions.length - 1
          ? currentQuestion
          : currentQuestion + 1;
      let commentsPage = false;
      if (nextQuestion === currentQuestion) commentsPage = true;
      this.setState({ questions, currentQuestion: nextQuestion, commentsPage });
    };
  }

  commentsChanged(comments) {
    this.setState({ comments });
  }

  completeAssessment() {
    //Create strength assessment
    //Create strength assessment values
    //Set Assessment Request Person completed
    let developmentQuestions = this.state.questions.slice(-4);

    let strengthAssessment = {};
    strengthAssessment.assessment_request = this.props.assessmentRequest.id;
    strengthAssessment.assessed_by_person = this.props.me.id;
    strengthAssessment.assessment_date = moment().format("YYYY-MM-DD");
    strengthAssessment.assessment_start_time = this.state.startTime;
    strengthAssessment.assessment_end_time = moment().format();
    strengthAssessment.location = "PLACEHOLDER";
    strengthAssessment.development_skill = developmentQuestions[0].score;
    strengthAssessment.development_knowledge = developmentQuestions[1].score;
    strengthAssessment.development_passion = developmentQuestions[2].score;
    strengthAssessment.development_wisdom = developmentQuestions[3].score;
    strengthAssessment.employee_additional_comments = this.state.comments;

    this.props.saveAssessment(
      this.props.token,
      strengthAssessment,
      this.assessmentSaved
    );
  }

  assessmentSaved(assessment) {
    let strengthAssessmentValues = this.state.questions
      .slice(0, -4)
      .map((q, i) => ({
        strength_assessment: assessment.id,
        value: q.value,
        value_score: q.score,
        order: i + 1
      }));
    this.props.saveStrengthAssessmentValues(
      this.props.token,
      strengthAssessmentValues,
      this.valuesSaved(assessment)
    );
  }

  valuesSaved(assessment) {
    return () => {
      this.props.setAssessmentRequestPersonCompleted(
        this.props.token,
        this.props.assessmentRequestPerson,
        this.finished
      );
    };
  }

  finished() {
    this.setState({ completed: true });
  }

  render() {
    let { currentQuestion } = this.state;
    if (this.state.completed) return <CompletedPage {...this.props} />;
    else if (this.state.landingPage)
      return <LandingPage {...this.props} begin={this.begin} />;
    else if (this.state.commentsPage)
      return (
        <CommentsPage
          {...this.props}
          back={this.previousQuestion(currentQuestion)}
          comments={this.state.comments}
          commentsChanged={this.commentsChanged}
          questionCount={this.state.questions.length}
          questionIndex={currentQuestion}
          completeAssessment={this.completeAssessment}
        />
      );
    else
      return (
        <Question
          {...this.props}
          questionIndex={currentQuestion}
          back={this.previousQuestion(currentQuestion)}
          next={this.nextQuestion(currentQuestion)}
          setScore={this.setScore(currentQuestion)}
          questions={this.state.questions}
        />
      );
  }
}

const mapStateToProps = (state, ownProps) => {
  let assessmentRequest = null,
    person = null,
    job_description = null,
    company_department = null,
    values = [],
    company = null;

  let assessmentRequestId = parseInt(
    ownProps.match.params.assessmentRequestId,
    10
  );

  assessmentRequest = state.strengthAssessmentRequests.items.find(
    ({ id }) => id === assessmentRequestId
  );

  if (assessmentRequest) {
    person = state.people.items.find(
      ({ id }) => id === assessmentRequest.person_assessed
    );
  }

  if (person) {
    job_description = state.jobDescriptions.items.find(
      ({ id }) => id === person.job_description
    );

    values = state.values.items.filter(
      ({ company }) => company === person.company
    );

    company = state.companies.items.find(c => c.id === person.company);
  }

  if (job_description) {
    company_department = state.companyDepartments.items.find(
      ({ id }) => id === job_description.company_department
    );
  }

  let me = state.me;

  let token = state.apiToken.value;

  let assessmentRequestPerson = state.assessmentRequestPeople.items.find(
    arp =>
      arp.strength_assessment_request === assessmentRequestId &&
      arp.assessed_by_person === me.id
  );

  return {
    assessmentRequest,
    person,
    job_description,
    company_department,
    values,
    me,
    token,
    assessmentRequestPerson,
    company
  };
};

const mapDispatchToProps = dispatch => ({
  saveAssessment: (token, strengthAssessment, callback) => {
    dispatch(saveAssessment(token, strengthAssessment, callback));
  },
  saveStrengthAssessmentValues: (token, assessmentValues, callback) => {
    dispatch(saveStrengthAssessmentValues(token, assessmentValues, callback));
  },
  setAssessmentRequestPersonCompleted: (
    token,
    assessmentRequestPerson,
    callback
  ) => {
    dispatch(
      setAssessmentRequestPersonCompleted(
        token,
        assessmentRequestPerson,
        callback
      )
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StrengthAssessment);
