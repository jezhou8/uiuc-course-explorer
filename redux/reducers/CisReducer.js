import {
	GET_CURRENT_COURSE,
	GET_CURRENT_COURSE_SUCCESS,
	GET_CURRENT_COURSE_FAILED,
} from "../actions/types";

const INITIAL_STATE = {};

export default function cisReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case GET_CURRENT_COURSE_SUCCESS:
			console.log(action.payload);
			return action.payload;
		case GET_CURRENT_COURSE_FAILED:
			return action.payload;
		default:
			return state;
	}
}
