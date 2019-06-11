//DevelopmentReviewInProgress.js

export const PERFORMANCE = "PERFORMANCE";
export const STRENGTH = "STRENGTH";
export const DEVELOPMENT = "DEVELOPMENT";

const START = "KRO/REVIEWINPROGRESS/START";
const STOP = "KRO/REVIEWINPROGRESS/STOP";

const initialState = {
  reviewInProgress: false,
  reviewType: "",
  reviewId: 0,
  managerId: 0,
  managerToken: "",
  other: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case START:
      return Object.assign(
        {},
        state,
        action.payload,
        { reviewInProgress: true }
      );
    case STOP:
      return initialState;
    default:
      return state;
  }
};

export const startReview = reviewInfo => ({
  type: START,
  payload: reviewInfo
});

export const stopReview = () => ({ type: STOP });
