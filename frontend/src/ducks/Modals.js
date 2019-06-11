//modals.js

//Constants
export const ATTENDANCE = 'ATTENDANCE';
export const PARKING_LOT = 'PARKING_LOT';
export const SUCCESS = 'SUCCESS';
export const CHALLENGE = 'CHALLENGE';
export const UPDATE_STATUS = 'UPDATE_STATUS';
export const STATUS_HISTORY = 'STATUS_HISTORY';
export const TEAM_ASSIGNMENT = 'TEAM_ASSIGNMENT';
export const DEVELOPMENT_ACTION_STEP = 'DEVELOPMENT_ACTION_STEP';

//Action Types
const OPEN = 'KRO/MODALS/OPEN';
const CLOSE = 'KRO/MODALS/CLOSE';

//intial state
const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case OPEN:
      return state.concat(action.payload);
    case CLOSE:
      return state.slice(0, state.length - 1);
    default:
      return state;
  }
};

export const openModal = (modalType, modalParameters) => ({
  type: OPEN,
  payload: {
    modalType,
    modalParameters
  }
});

export const closeModal = () => ({
  type: CLOSE
});
