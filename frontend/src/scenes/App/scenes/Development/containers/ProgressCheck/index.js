import React from "react";
import Button from "components/Button";
import "./style.css";

const ProgressCheck = props => (
    <div className="progress-check">
        <h4>There is currently a review in progress.  Would you like to resume the review, or would you like to discard it and begin a new review?</h4>
        <div className="buttons">
            <Button className="resume" click={props.resume}>Resume</Button>
            <Button className="discard" click={props.discard}>Discard</Button>
        </div>
    </div>
);

export default ProgressCheck;