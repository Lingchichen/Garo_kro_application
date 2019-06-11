import React from "react";
import "./style.css";

const Field = props => (
  <div
    className={
      "field" +
      (props.className ? " " + props.className : "") +
      (props.name ? " " + props.name : "")
    }
  >
    <label htmlFor={props.name}>{props.label}</label>
    <input
      type={props.type ? props.type : "text"}
      id={props.name}
      placeholder={props.placeholder ? props.placeholder : ""}
      value={props.value}
      onChange={props.valueChanged}
    />
  </div>
);

export default Field;
