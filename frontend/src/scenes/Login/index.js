import React from "react";
import { connect } from "react-redux";
import kroLogo from "images/powered-by-kro.png";
import asOneLogo from "images/working-as-one.png";
import LoadingIndicator from "components/LoadingIndicator";
import LoginForm from "./containers/LoginForm";
import "./style.css";
import Box from "components/Box";

const Login = props => (
  <div className="login-form">
    <img className="kro-logo" src={kroLogo} alt="Powered by KRO" />
    <img className="as-one-logo" src={asOneLogo} alt="Working as One" />
    <Box className="the-form">
      {props.isFetching && <LoadingIndicator />}
      {!props.isFetching && <LoginForm />}
    </Box>
  </div>
);

const mapStateToProps = state => ({ isFetching: state.apiToken.isFetching });

export default connect(mapStateToProps)(Login);
