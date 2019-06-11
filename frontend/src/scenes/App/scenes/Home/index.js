import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const Home = props => (
  <div className="home">
    <h3 style={{ textAlign: "center" }}>Home</h3>
    {props.assessmentRequests.length > 0 && (
      <ul>
        {props.assessmentRequests.map(ar => {
          let { first_name, last_name } = ar.person_assessed.user;
          let name = `${first_name} ${last_name}`;
          return (
            <li key={ar.id}>
              <Link to={`/development/strength-assessments/${ar.id}`}>
                Strength Assessment for {name}
              </Link>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

const mapStateToProps = state => {
  let me = state.me;

  let assessmentRequestIds = state.assessmentRequestPeople.items
    .filter(arp => arp.assessed_by_person === me.id && !arp.completed)
    .map(arp => arp.strength_assessment_request);

  let assessmentRequests = state.strengthAssessmentRequests.items
    .filter(ar => assessmentRequestIds.includes(ar.id))
    .map(ar =>
      Object.assign({}, ar, {
        person_assessed: state.people.items.find(
          p => p.id === ar.person_assessed
        )
      })
    );

  return {
    assessmentRequests
  };
};

export default connect(mapStateToProps)(Home);
