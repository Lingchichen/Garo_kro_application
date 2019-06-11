import React, { Component } from "react";
import { connect } from "react-redux";
import { login } from "ducks/ApiToken";
import Field from "components/Field";
import Button from "components/Button";
import "./style.css";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.usernameChanged = this.usernameChanged.bind(this);
    this.passwordChanged = this.passwordChanged.bind(this);
    this.toggleRemember = this.toggleRemember.bind(this);
    this.login = this.login.bind(this);
    this.state = {
      username: "",
      password: "",
      rememberMe: false
    };
  }

  usernameChanged(event) {
    this.setState({ username: event.target.value });
  }

  passwordChanged(event) {
    this.setState({ password: event.target.value });
  }

  toggleRemember() {
    this.setState({ rememberMe: !this.state.rememberMe });
  }

  login(e) {
    e.preventDefault();
    this.props.login(
      this.state.username,
      this.state.password,
      this.state.rememberMe
    );
  }

  render() {
    return (
      <form onSubmit={this.login}>
        <div className="prompt text-center">Please login below:</div>
        <Field
          className="field-row"
          name="username"
          label="Username"
          placeholder="jsmith"
          value={this.state.username}
          valueChanged={this.usernameChanged}
        />
        <Field
          type="password"
          className="field-row"
          name="password"
          label="Password"
          placeholder="password"
          value={this.state.password}
          valueChanged={this.passwordChanged}
        />
        <div className="remember-row">
          <input
            type="checkbox"
            id="remember-me"
            checked={this.state.rememberMe}
            onChange={this.toggleRemember}
          />
          <label htmlFor="remember-me" />
          Remember Me
        </div>
        <div className="submit-row">
          <Button type="submit">LOGIN</Button>
        </div>
        <div className="forgot-password">
          <a href="#/">Forgot Password</a>
        </div>
      </form>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  login: (u, p, r) => {
    dispatch(login(u, p, r));
  }
});

export default connect(null, mapDispatchToProps)(LoginForm);
