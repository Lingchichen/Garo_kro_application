import React from "react";
import MeetingListItemBody from "./MeetingsListItemBody";
import meetingIcon from "images/meetingG.png";
import downloadIcon from "images/download.png";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

const MeetingsListItem = ({ meeting, meetingType, opened, open }) => {
  let datetime = new Date(meeting.date_time);
  let month = monthNames[datetime.getMonth()];
  let day = datetime.getDate();
  let year = datetime.getFullYear();
  let hour = datetime.getHours();
  let ampm = "AM";
  if (hour > 12) {
    hour -= 12;
    ampm = "PM";
  }
  let mins = datetime.getMinutes();
  if (mins < 10) mins = "0" + mins;
  let time = "" + hour + ":" + mins + ampm;
  return (
    <li className={opened ? "open" : ""}>
      <img src={meetingIcon} alt="" />
      <div className="meeting-title" onClick={open}>
        {meetingType.meeting_title}
      </div>
      <div className="date">
        {month} {day}-{year}
      </div>
      <div className="time-location">
        {time}, {meeting.location}
      </div>
      <img className="download" src={downloadIcon} alt="" />
      {opened && (
        <MeetingListItemBody
          meeting={meeting}
          description={meetingType.description}
        />
      )}
    </li>
  );
};

export default MeetingsListItem;
