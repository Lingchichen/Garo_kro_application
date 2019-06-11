//CompletedTopics.js

//Actions
const COMPLETE = 'KRO/COMPLETEDTOPICS/COMPLETE';

//Initial State
const initialState = [];

//Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case COMPLETE:
      return state.concat(action.payload);
    default:
      return state;
  }
};

//Action Creators
export const completeTopic = topic_id => ({
  type: COMPLETE,
  payload: topic_id
});
