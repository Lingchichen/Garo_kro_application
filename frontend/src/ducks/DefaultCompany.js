//DefaultCompany.js

//Actions
const SET = 'KRO/DEFAULTCOMPANY/SET';
const RESET = 'KRO/DEFAULTCOMPANY/RESET';

//Initial State
const initialState = null;

//Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case SET:
      return action.payload;
    case RESET:
      return null;
    default:
      return state;
  }
};

//Action Creators
export const setDefaultCompany = company_id => ({
  type: SET,
  payload: company_id
});

export const resetDefaultCompany = () => ({ type: RESET });
