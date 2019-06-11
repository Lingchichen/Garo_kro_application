import React from "react";
import { connect } from "react-redux";
import * as Alerts from "ducks/Alerts";
import "./style.css";

const Alert = ({ alert, remove }) => {
  let className = "alert-info";
  if (alert.alertType === Alerts.DANGER) className = "alert-danger";
  if (alert.alertType === Alerts.WARNING) className = "alert-warning";
  return (
    <div className={"alert alert-dismissible " + className} role="alert">
      {alert.message}
      <button
        type="button"
        className="close"
        aria-label="Close"
        onClick={remove(alert.id)}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};

const AlertsArea = ({ alerts, remove }) => (
  <div className="notification-area">
    {alerts.map(alert => (
      <Alert key={alert.id} alert={alert} remove={remove} />
    ))}
  </div>
);

const mapStateToProps = state => ({
  alerts: state.alerts
});

const mapDispatchToProps = dispatch => ({
  remove: id => {
    return () => {
      dispatch(Alerts.removeAlert(id));
    };
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertsArea);
