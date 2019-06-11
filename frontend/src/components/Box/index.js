import React from "react";
import "./style.css";

const Box = props => (
  <div className={"box" + (props.className ? " " + props.className : "")}>
    {props.children}
  </div>
);

export default Box;
