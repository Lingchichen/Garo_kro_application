import React from "react";
import { Link } from "react-router-dom";
import TopBar from "./TopBar";

const CommentsPage = props => (
    <div className="comments-page">
        <h3 style={{ textAlign: "center" }}>
            EMPLOYEE STRENGTH ASSESSMENT REVIEW
            <Link to="/development" className="exit">&times;</Link>
        </h3>
        <TopBar {...props} />
        <div className="comments-body">
            <div className="reviewer-comments">
                <div className="comment-box-header">Reviewer Comments</div>
                {props.reviewers_comments_errors.map(error =>
                    <div className="error-msg">{error}</div>
                )}
                <textarea
                    className={
                        props.reviewers_comments_errors.length
                          ? "error"
                          : ""
                    }
                    value={props.reviewerComments}
                    onChange={
                        e => { props.reviewerCommentsChanged(e.target.value); }
                    }
                    onBlur={() => { props.updateReview(); }}
                />
            </div>
            <div className="employee-comments">
                <div className="comment-box-header">Employee Comments</div>
                {props.employee_comments_errors.map(error =>
                    <div className="error-msg">{error}</div>
                )}
                <textarea
                    className={
                        props.employee_comments_errors.length
                          ? "error"
                          : ""
                    }
                    value={props.employeeComments}
                    onChange={
                        e => { props.employeeCommentsChanged(e.target.value); }
                    }
                    onBlur={() => { props.updateReview(); }}
                />
            </div>
        </div>
    </div>
);

export default CommentsPage;