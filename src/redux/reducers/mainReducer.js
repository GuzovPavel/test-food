import { SET_ID } from "../types";
const initialState = {
  id: "",
};

export const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ID:
      return {
        ...state,
        id: action.payload,
      };

    default:
      return state;
  }
};
