import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setDefaultCompany } from 'ducks/DefaultCompany';
import kroLogo from 'images/powered-by-kro.png';
import asOneLogo from 'images/working-as-one.png';
import Box from 'components/Box';
import Button from 'components/Button';
import './style.css';

class CompanySelect extends Component {
  constructor(props) {
    super(props);
    this.buttonClicked = this.buttonClicked.bind(this);
    this.state = {
      selected: null
    };
  }

  buttonClicked() {
    if (this.state.selected) this.props.selectCompany(this.state.selected);
  }

  companySelected(company_id) {
    return () => {
      this.setState({ selected: company_id });
    };
  }

  listCompanies() {
    return this.props.companies.map(company => {
      let province = this.props.provinces.find(
        ({ id }) => id === company.province
      );
      return (
        <li
          key={company.id}
          onClick={this.companySelected(company.id)}
          className={this.state.selected === company.id ? 'selected' : ''}
        >
          <div className="company-name">{company.name}</div>
          <div className="company-location">
            {company.city}, {province ? province.name : ''}
          </div>
        </li>
      );
    });
  }

  render() {
    return (
      <div className="company-select">
        <img className="kro-logo" src={kroLogo} alt="Powered by KRO" />
        <img className="as-one-logo" src={asOneLogo} alt="Working as One" />
        <Box className="the-form">
          <div className="prompt text-center">
            Please select a default company:
          </div>
          <ul>{this.listCompanies()}</ul>
          <Button click={this.buttonClicked}>Select</Button>
        </Box>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  companies: state.companies.items,
  provinces: state.provinces.items
});

const mapDispatchToProps = dispatch => ({
  selectCompany: company_id => {
    dispatch(setDefaultCompany(company_id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CompanySelect);
