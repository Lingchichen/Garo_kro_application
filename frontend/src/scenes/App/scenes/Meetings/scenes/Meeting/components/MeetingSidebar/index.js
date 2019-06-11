import React from "react";
import meetingIcon from "images/meetingG.png";

const MeetingSidebar = ({ description }) => (
  <div
    className="box meeting-sidebar"
    style={{
      width: "49%",
      float: "right",
      textAlign: "center",
      padding: "30px",
      minHeight: "375px"
    }}
  >
    <img src={meetingIcon} alt="" style={{ width: "60px" }} />
    <div
      className="meeting-description"
      style={{ textAlign: "left", marginTop: "20px" }}
    >
      <p>{description}</p>
      <p>
        Please take your seat and mute your phones. Meeting is about to start.
      </p>
    </div>
  </div>
);

export default MeetingSidebar;
