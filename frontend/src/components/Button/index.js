import React from "react";
import "./style.css";

const Button = props => (
  <button
    type={props.type ? props.type : "button"}
    className={"button" + (props.className ? " " + props.className : "")}
    onClick={props.click ? props.click : () => false}
  >
    {props.children}
  </button>
);

export default Button;
