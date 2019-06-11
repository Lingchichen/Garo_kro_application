//Alerts.js

//CONSTANTS
export const INFO = "KRO/ALERTS/INFO";
export const WARNING = "KRO/ALERTS/WARNING";
export const DANGER = "KRO/ALERTS/DANGER";

//Actions
const ADD = "KRO/ALERTS/ADD";
const REMOVE = "KRO/ALERTS/REMOVE";

//Initial State
const initialState = [];

//Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case ADD:
      const newState = state.slice();
      newState.push(action.payload);
      return newState;
    case REMOVE:
      return state.filter(alert => alert.id !== action.payload);
    default:
      return state;
  }
};

let nextId = 0;

// Action Creators
export const addAlert = (alertType = INFO, message) => ({
  type: ADD,
  payload: {
    id: nextId++,
    alertType,
    message
  }
});

export const removeAlert = id => ({
  type: REMOVE,
  payload: id
});

/*
{
  type: 'KRO/ALERTS/ADD',
  payload: {
    id: 9999,
    alertType: 'DANGER',
    message: 'This is a test alert, please ignore'
  }
}
*/
