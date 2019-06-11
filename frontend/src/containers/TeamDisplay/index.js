import React from 'react';
import { connect } from 'react-redux';
import Box from 'components/Box';
import Button from 'components/Button';
import teamIcon from 'images/team.png';
import './style.css';

const TeamDisplay = props => (
  <Box className="team-display">
    <div className="header">
      <img src={teamIcon} alt="" /> Assigned Team
    </div>
    <ul>
      {props.teamMembers.map(member => (
        <li key={member.id}>
          {member.person
            ? `${member.person.user.first_name} ${member.person.user.last_name}`
            : ''}
          {member.company_department ? member.company_department.name : ''}
          {member.external_vendor ? member.external_vendor : ''}
        </li>
      ))}
    </ul>
    <Button click={props.assignClicked}>Assign Team</Button>
  </Box>
);

const mapStateToProps = (state, ownProps) => {
  let teamId = ownProps.teamId;
  let teamMembers = [];
  if (teamId) {
    teamMembers = state.teamMembers.items
      .filter(({ team }) => team === teamId)
      .map(member => {
        let expandedMember = Object.assign({}, member);
        if (expandedMember.member_type === 'PERSON')
          expandedMember.person = state.people.items.find(
            ({ id }) => id === expandedMember.person
          );
        else if (expandedMember.member_type === 'DEPARTMENT')
          expandedMember.company_department = state.companyDepartments.items.find(
            ({ id }) => id === expandedMember.company_department
          );
        return expandedMember;
      });
  }
  return { teamMembers };
};

export default connect(mapStateToProps)(TeamDisplay);
