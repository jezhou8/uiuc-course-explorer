import {
	GET_CURRENT_COURSE,
	GET_CURRENT_COURSE_SUCCESS,
	GET_CURRENT_COURSE_FAILED,
} from "../actions/types";

const INITIAL_STATE = { loading: true };

export default function cisReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case GET_CURRENT_COURSE_SUCCESS:
			return { loading: false, ...action.payload };
		case GET_CURRENT_COURSE_FAILED:
			return { loading: false, ...action.payload };
		case GET_CURRENT_COURSE:
			return { ...state, loading: true };
		default:
			return state;
	}
}
