import React, { Component } from 'react';
import { connect } from 'react-redux';
import { checkToken } from 'ducks/ApiToken';
import LoadingIndicator from 'components/LoadingIndicator';
import App from 'scenes/App';
import AlertsContainer from 'containers/Alerts';
import Modals from 'containers/Modals';
import Login from 'scenes/Login';
import './style.css';

class AppContainer extends Component {
  componentDidMount() {
    this.props.checkToken(this.props.apiToken.value);
  }

  render() {
    let loadingIndicator = this.props.apiToken.valid === null;
    let loggedIn = !loadingIndicator && this.props.apiToken.valid;
    let notLoggedIn = !loadingIndicator && !loggedIn;
    return (
      <div>
        <AlertsContainer />
        <div className="app-container">
          <Modals />
          {loadingIndicator && <LoadingIndicator />}
          {loggedIn && <App />}
          {notLoggedIn && <Login />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  apiToken: state.apiToken
});

const mapDispatchToProps = dispatch => ({
  checkToken: token => {
    dispatch(checkToken(token));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
