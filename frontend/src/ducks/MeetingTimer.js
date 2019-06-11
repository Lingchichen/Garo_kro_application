//MeetingTimer.js

//Action Types
const START = "KRO/MEETINGTIMER/START";
const STOP = "KRO/MEETINGTIMER/STOP";
const TICK = "KRO/MEETINGTIMER/TICK";
const RESUME = "KRO/MEETINGTIMER/RESUME";
const RESET = "KRO/MEETINGTIMER/RESET";
const SET_VIEW = "KRO/MEETINGTIMER/SET_VIEW";

export const PARKING_LOT = "PARKING_LOT";
export const PROJECTS = "PROJECTS";
export const FINANCIAL = "FINANCIAL";
export const SUCCESSES = "SUCCESSES";
export const DESCRIPTION = "DESCRIPTION";

let timer = null;

//Initial State
const initialState = {
  meeting_id: null,
  running: false,
  negative: false,
  timeLeft: 0,
  meeting_view: DESCRIPTION
};

export default (state = initialState, action) => {
  let timeLeft, negative;
  switch (action.type) {
    case START:
      timeLeft =
        Date.parse(action.payload.end_date_time) -
        Date.parse(action.payload.start_date_time);
      negative = timeLeft < 0;
      return {
        meeting_id: action.payload.meeting_id,
        running: true,
        negative,
        timeLeft,
        meeting_view: action.payload.meeting_view
      };
    case STOP:
      return Object.assign({}, state, { running: false });
    case RESUME:
      return Object.assign({}, state, { running: true });
    case TICK:
      timeLeft = state.timeLeft;
      negative = state.negative;
      if (!negative && timeLeft >= 0) {
        if (timeLeft - 1000 >= 0) timeLeft -= 1000;
        else {
          timeLeft = 1000 - timeLeft;
          negative = true;
        }
      } else timeLeft += 1000;
      return Object.assign({}, state, { negative, timeLeft });
    case RESET:
      return initialState;
    case SET_VIEW:
      return Object.assign({}, state, { meeting_view: action.payload });
    default:
      return state;
  }
};

export const startMeetingTimer = (meeting, currentView) => dispatch => {
  clearInterval(timer);

  timer = setInterval(() => {
    dispatch({ type: TICK });
  }, 1000);

  dispatch({
    type: START,
    payload: {
      meeting_id: meeting.id,
      start_date_time: meeting.start_date_time,
      end_date_time: meeting.end_date_time,
      meeting_view: currentView
    }
  });
};

export const setMeetingView = meeting_view => ({
  type: SET_VIEW,
  payload: meeting_view
});

export const resetMeetingTimer = () => ({ type: RESET });

export const resumeMeetingTimer = () => dispatch => {
  clearInterval(timer);

  timer = setInterval(() => {
    dispatch({ type: TICK });
  }, 1000);

  dispatch({ type: RESUME });
};

export const stopMeetingTimer = () => {
  clearInterval(timer);

  return { type: STOP };
};
