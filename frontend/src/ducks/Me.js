//Me.js
import Api from 'Api';
import * as Alerts from './Alerts';

//Constants
const ERROR = 'ERROR';
const SUCCESS = 'SUCCESS';

//Actions
const FETCH = 'KRO/ME/FETCH';

//Initial State
const initialState = {
  isFetching: false,
  id: 0,
  user: {
    id: 0,
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    is_staff: false,
    is_active: false,
    date_joined: '',
    is_superuser: false,
    groups: [],
    user_permissions: []
  },
  phone: '',
  company: 0,
  is_owner: false,
  is_manager: false,
  is_employee: false,
  is_third_party: false,
  job_description: 0,
  join_date: '',
  position_date: '',
  employee_number: ''
};

//Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH:
      if (action.status && action.status === SUCCESS)
        return Object.assign({}, action.payload, { isFetching: false });
      if (action.status && action.status === ERROR)
        return Object.assign({}, state, {
          isFetching: false
        });
      return Object.assign({}, state, { isFetching: true });
    default:
      return state;
  }
};

//Async Thunks
export const fetchMe = token => dispatch => {
  dispatch({ type: FETCH });
  new Api(token)
    .get('me')
    .then(response => {
      dispatch({ type: FETCH, status: SUCCESS, payload: response.data });
    })
    .catch(error => {
      fetchMeHandleError(dispatch, error);
    });
};

//Error Handling
const fetchMeHandleError = (dispatch, error) => {
  console.log(error);
  dispatch({ type: FETCH, status: ERROR });
  if (error.response) {
    if (error.response.status >= 500) dispatch(internalServerError());
    else dispatch(badRequestError());
  } else if (error.request) dispatch(noResponse());
  else dispatch(unknownError());
};

const badRequestError = () => Alerts.addAlert(Alerts.DANGER, 'Bad Request');

const internalServerError = () =>
  Alerts.addAlert(Alerts.DANGER, 'Internal Server Error.');

const noResponse = () =>
  Alerts.addAlert(Alerts.DANGER, 'No response received from server.');

const unknownError = () =>
  Alerts.addAlert(Alerts.DANGER, 'Could not send request to the server.');
