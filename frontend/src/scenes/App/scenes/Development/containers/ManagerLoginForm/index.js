import React from "react";
import Field from "components/Field";
import Button from "components/Button";
import "./style.css";

const ManagerLoginForm = props => (
  <div className="login-form">
    <form
      onSubmit={e => {
        e.preventDefault();
        props.managerLogin();
      }}
    >
      <div className="prompt text-center">
        Please have your manager login below:
      </div>
      {props.managerLoginError && (
        <div className="error">{props.managerLoginError}</div>
      )}
      <Field
        className="field-row"
        label="Username"
        placeholder="jsmith"
        value={props.managerUsername}
        valueChanged={props.managerUsernameChanged}
      />
      <Field
        type="password"
        className="field-row"
        label="Password"
        placeholder="password"
        value={props.managerPassword}
        valueChanged={props.managerPasswordChanged}
      />
      <div className="submit-row">
        <Button type="submit">LOGIN</Button>
      </div>
    </form>
  </div>
);

export default ManagerLoginForm;
