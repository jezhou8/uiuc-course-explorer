import {
	GET_COURSES,
    GET_COURSES_SUCCESS,
    GET_COURSES_FAILED
} from "../actions/types";

const INITIAL_STATE = { loading: true };

export default function DbReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case GET_COURSES_SUCCESS:
			return { loading: false, ...action.payload };
		case GET_COURSES_FAILED:
			return { loading: false, ...action.payload };
		case GET_COURSES:
			return { ...state, loading: true };
		default:
			return state;
	}
}
