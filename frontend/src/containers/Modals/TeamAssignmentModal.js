import React, { Component } from "react";
import { connect } from "react-redux";
import { closeModal } from "ducks/Modals";
import { createTeam } from "ducks/Teams";
import { createTeamMembers, deleteTeamMembers } from "ducks/TeamMembers";
import Button from "components/Button";

class TeamAssignmentModal extends Component {
  constructor(props) {
    super(props);
    this.STAFF = "STAFF";
    this.DEPARTMENT = "DEPARTMENT";
    this.EXTERNAL = "EXTERNAL";

    this.closeModal = this.closeModal.bind(this);
    this.staffSelectionChanged = this.staffSelectionChanged.bind(this);
    this.departmentSelectionChanged = this.departmentSelectionChanged.bind(
      this
    );
    this.addMember = this.addMember.bind(this);
    this.deleteMembers = this.deleteMembers.bind(this);
    this.save = this.save.bind(this);
    this.createTeamMembers = this.createTeamMembers.bind(this);

    this.state = {
      filter: this.STAFF,
      role: "",
      selectedStaff: [],
      selectedDepartments: [],
      contractor: "",
      teamMembers: {
        staff: [],
        departments: [],
        contractors: []
      },
      team: 0
    };

    if (props.teamMembers.length) {
      this.state.teamMembers.staff = props.teamMembers.filter(
        tm => (tm.person ? true : false)
      );
      this.state.teamMembers.departments = props.teamMembers.filter(
        tm => (tm.department ? true : false)
      );
      this.state.teamMembers.contractors = props.teamMembers.filter(
        tm => (tm.name ? true : false)
      );
    }

    if (props.team) this.state.team = props.team;
  }

  closeModal() {
    this.props.closeModal();
  }

  staffSelectionChanged(e) {
    var options = e.target.options;
    var value = [];
    for (var i = 0; i < options.length; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    this.setState({ selectedStaff: value });
  }

  departmentSelectionChanged(e) {
    var options = e.target.options;
    var value = [];
    for (var i = 0; i < options.length; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    this.setState({ selectedDepartments: value });
  }

  addMember() {
    if (this.state.filter === this.STAFF) this.addStaffMembers();
    if (this.state.filter === this.DEPARTMENT) this.addDepartments();
    if (this.state.filter === this.EXTERNAL) this.addExternal();
  }

  addStaffMembers() {
    let teamMembers = Object.assign({}, this.state.teamMembers);
    teamMembers.staff = teamMembers.staff.concat(
      this.state.selectedStaff.map(p => ({
        person: parseInt(p, 10),
        role: this.state.role,
        selected: false
      }))
    );
    this.setState({ teamMembers, role: "", selectedStaff: [] });
  }

  addDepartments() {
    let teamMembers = Object.assign({}, this.state.teamMembers);
    teamMembers.departments = teamMembers.departments.concat(
      this.state.selectedDepartments.map(d => ({
        department: parseInt(d, 10),
        role: this.state.role,
        selected: false
      }))
    );
    this.setState({ teamMembers, role: "", selectedDepartments: [] });
  }

  addExternal() {
    let teamMembers = Object.assign({}, this.state.teamMembers);
    teamMembers.contractors = teamMembers.contractors.concat([
      {
        name: this.state.contractor,
        role: this.state.role,
        selected: false
      }
    ]);
    this.setState({ teamMembers, role: "", contractor: "" });
  }

  deleteMembers() {
    let teamMembers = Object.assign({}, this.state.teamMembers);
    teamMembers.staff = teamMembers.staff.filter(s => !s.selected);
    teamMembers.departments = teamMembers.departments.filter(d => !d.selected);
    teamMembers.contractors = teamMembers.contractors.filter(c => !c.selected);
    this.setState({ teamMembers });
  }

  save() {
    let { staff, departments, contractors } = this.state.teamMembers;
    if (staff.length || departments.length || contractors.length) {
      if (this.state.team) {
        this.props.deleteTeamMembers(
          this.props.token,
          this.props.teamMembers,
          () => {
            this.createTeamMembers(this.state.team);
          }
        );
      } else {
        this.props.createTeam(this.props.token, { active: true }, newTeam => {
          this.createTeamMembers(newTeam.id);
        });
      }
    }
  }

  createTeamMembers(newTeam) {
    let { staff, departments, contractors } = this.state.teamMembers;
    let newTeamMembers = [];

    newTeamMembers = newTeamMembers.concat(
      staff.map(member => ({
        team: newTeam,
        member_type: "PERSON",
        person: member.person,
        role: member.role
      }))
    );

    newTeamMembers = newTeamMembers.concat(
      departments.map(member => ({
        team: newTeam,
        member_type: "DEPARTMENT",
        company_department: member.department,
        role: member.role
      }))
    );

    newTeamMembers = newTeamMembers.concat(
      contractors.map(member => ({
        team: newTeam,
        member_type: "EXTERNAL",
        external_vendor: member.name,
        role: member.role
      }))
    );

    this.props.createTeamMembers(this.props.token, newTeamMembers, () => {
      this.props.parameters.teamAssembled(newTeam);
      this.props.closeModal();
    });
  }

  render() {
    let heading = `Assign Team to ${this.props.parameters.heading}`;
    return (
      <div className="kro-modal team-assignment-modal">
        <h3>{heading}</h3>
        <div className="gray-box">
          <div className="filters">
            <div className="member-type">
              <h5>Team Member Type</h5>
              <div>
                <div
                  className={`radio-button${
                    this.state.filter === this.STAFF ? " active" : ""
                  }`}
                  onClick={() => {
                    this.setState({ filter: this.STAFF });
                  }}
                />{" "}
                Company Staff
              </div>
              <div>
                <div
                  className={`radio-button${
                    this.state.filter === this.DEPARTMENT ? " active" : ""
                  }`}
                  onClick={() => {
                    this.setState({ filter: this.DEPARTMENT });
                  }}
                />{" "}
                Department
              </div>
              <div>
                <div
                  className={`radio-button${
                    this.state.filter === this.EXTERNAL ? " active" : ""
                  }`}
                  onClick={() => {
                    this.setState({ filter: this.EXTERNAL });
                  }}
                />{" "}
                External Contractor
              </div>
            </div>
            <div className="role">
              <h5>Role</h5>
              <input
                type="text"
                value={this.state.role}
                onChange={e => {
                  this.setState({ role: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="selector">
            {this.state.filter === this.STAFF && (
              <div>
                <h5>Select Company Staff</h5>
                <select
                  multiple
                  value={this.state.selectedStaff}
                  onChange={this.staffSelectionChanged}
                >
                  {this.props.staff
                    .sort((a, b) => {
                      if (a.user.last_name < b.user.last_name) return -1;
                      if (a.user.last_name > b.user.last_name) return 1;
                      return 0;
                    })
                    .map(person => {
                      let alreadySelected = this.state.teamMembers.staff.find(
                        s => parseInt(s.person, 10) === person.id
                      );
                      if (alreadySelected) return null;
                      let name = `${person.user.first_name} ${
                        person.user.last_name
                      }`;
                      return (
                        <option key={person.id} value={person.id}>
                          {name}
                        </option>
                      );
                    })}
                </select>
              </div>
            )}
            {this.state.filter === this.DEPARTMENT && (
              <div>
                <h5>Select Department</h5>
                <select
                  multiple
                  value={this.state.selectedDepartments}
                  onChange={this.departmentSelectionChanged}
                >
                  {this.props.departments.map(department => {
                    let alreadySelected = this.state.teamMembers.departments.find(
                      d => parseInt(d.department, 10) === department.id
                    );
                    if (alreadySelected) return null;
                    return (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
            {this.state.filter === this.EXTERNAL && (
              <div className="contractor">
                <h5>Contractor</h5>
                <input
                  type="text"
                  value={this.state.contractor}
                  onChange={e => this.setState({ contractor: e.target.value })}
                />
              </div>
            )}
          </div>
          <div className="add-button">
            <Button click={this.addMember}>Add</Button>
          </div>
        </div>
        <div className="gray-box">
          <h5>Assigned Team</h5>
          <table>
            <tbody>
              {this.state.teamMembers.staff.map((s, index) => {
                let person = this.props.staff.find(({ id }) => id === s.person);
                let name = `${person.user.first_name} ${person.user.last_name}`;
                return (
                  <tr
                    key={s.person}
                    className={s.selected ? "active" : ""}
                    onClick={() => {
                      let teamMembers = Object.assign(
                        {},
                        this.state.teamMembers
                      );
                      let member = teamMembers.staff.find(
                        ({ person }) => person === s.person
                      );
                      member.selected = !member.selected;
                      this.setState(teamMembers);
                    }}
                  >
                    <td>{name}</td>
                    <td>{s.role}</td>
                  </tr>
                );
              })}
              {this.state.teamMembers.departments.map(d => {
                let department = this.props.departments.find(
                  ({ id }) => id === d.department
                );
                return (
                  <tr
                    key={d.department}
                    className={d.selected ? "active" : ""}
                    onClick={() => {
                      let teamMembers = Object.assign(
                        {},
                        this.state.teamMembers
                      );
                      let member = teamMembers.departments.find(
                        ({ department }) => department === d.department
                      );
                      member.selected = !member.selected;
                      this.setState(teamMembers);
                    }}
                  >
                    <td>{department.name}</td>
                    <td>{d.role}</td>
                  </tr>
                );
              })}
              {this.state.teamMembers.contractors.map((c, index) => (
                <tr
                  key={index}
                  className={c.selected ? "active" : ""}
                  onClick={() => {
                    let teamMembers = Object.assign({}, this.state.teamMembers);
                    let member = teamMembers.contractors[index];
                    member.selected = !member.selected;
                    this.setState(teamMembers);
                  }}
                >
                  <td>{c.name}</td>
                  <td>{c.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="buttons">
            <Button click={this.save}>Save</Button>
            <Button click={this.closeModal}>Cancel</Button>
          </div>
          <div className="delete-button">
            <Button click={this.deleteMembers}>Delete</Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let staff = [];
  let departments = [];

  let team = 0;
  let teamMembers = [];
  if (ownProps.parameters.team) {
    team = ownProps.parameters.team;
    teamMembers = state.teamMembers.items
      .filter(tm => tm.team === team)
      .map(tm => {
        let r = { id: tm.id, role: tm.role, selected: false };
        if (tm.member_type === "PERSON") r.person = tm.person;
        if (tm.member_type === "DEPARTMENT")
          r.department = tm.company_department;
        if (tm.member_type === "EXTERNAL") r.name = tm.external_vendor;
        return r;
      });
  }

  if (ownProps.parameters.company) {
    staff = state.people.items.filter(
      ({ company }) => company === ownProps.parameters.company
    );

    departments = state.companyDepartments.items.filter(
      ({ company }) => company === ownProps.parameters.company
    );
  }

  return {
    staff,
    departments,
    token: state.apiToken.value,
    team,
    teamMembers
  };
};

const mapDispatchToProps = dispatch => ({
  closeModal: () => {
    dispatch(closeModal());
  },
  createTeam: (token, newTeam, callback) => {
    dispatch(createTeam(token, newTeam, callback));
  },
  createTeamMembers: (token, newTeamMembers, callback) => {
    dispatch(createTeamMembers(token, newTeamMembers, callback));
  },
  deleteTeamMembers: (token, teamMembers, callback) => {
    dispatch(deleteTeamMembers(token, teamMembers, callback));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(
  TeamAssignmentModal
);
