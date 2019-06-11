import React from "react";
import Button from "components/Button";
import { Link } from 'react-router-dom'
const TopBar = props => (
  <div>
    <div className="buttons" >
      <Link to={'/development/'}><Button className={`small-btn${props.dashboardPage ? " active" : ""}`} >Dashboard</Button></Link>
      <Button className="small-btn active" click={props.reviewClicked}>Review</Button>
    </div>
  </div>
);

export default TopBar;
