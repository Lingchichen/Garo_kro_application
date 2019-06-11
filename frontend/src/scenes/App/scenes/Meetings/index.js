import React, { Component } from "react";
import MeetingsList from "./containers/MeetingsList";
import { withRouter } from "react-router-dom";
import { Route } from "react-router-dom";
import Meeting from "./scenes/Meeting";

class Meetings extends Component {
  render() {
    return (
      <div className="meetings">
        <Route exact path={`/meetings`} component={MeetingsList} />
        <Route path={`/meetings/:meetingId`} component={Meeting} />
      </div>
    );
  }
}

export default withRouter(Meetings);
