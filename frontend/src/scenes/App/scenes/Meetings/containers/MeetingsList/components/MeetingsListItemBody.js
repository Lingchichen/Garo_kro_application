import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'components/Button';
import { openModal, ATTENDANCE } from 'ducks/Modals';
import { connect } from 'react-redux';

const MeetingListItemBody = ({ meeting, description, openAttendanceModal }) => {
  let start = new Date(meeting.start_date_time).getTime();
  let end = new Date(meeting.end_date_time).getTime();

  let mins = Math.floor((end - start) / 1000 / 60);
  let hrs = Math.floor(mins / 60);
  mins -= hrs * 60;

  if (hrs) hrs = hrs + ' hr';
  if (hrs > 1) hrs += 's';
  if (!hrs) hrs = '';

  if (mins) mins = mins + ' min';
  if (mins > 1) mins += 's';
  if (!mins) mins = '';

  let duration = hrs + ' ' + mins;
  if (!hrs && !mins) duration = '< 1 min';

  let completed = false;
  if (start < Date.now()) completed = true;

  return (
    <div className="body">
      <div className="duration">Duration: {duration}</div>
      <div className="description">{description}</div>
      <div className="buttons">
        {completed && (
          <Link to={`/meetings/${meeting.id}`}>
            <Button className="small-btn">Meeting Notes</Button>
          </Link>
        )}
        {!completed && (
          <Link to={`/meetings/${meeting.id}`}>
            <Button className="small-btn">Open Meeting</Button>
          </Link>
        )}
        <Button className="small-btn" click={openAttendanceModal(meeting.id)}>
          Attendance
        </Button>
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  openAttendanceModal: id => () => {
    dispatch(openModal(ATTENDANCE, { meeting_id: id }));
  }
});

export default connect(null, mapDispatchToProps)(MeetingListItemBody);
