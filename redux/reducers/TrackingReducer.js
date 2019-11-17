import {
	TRACK_SECTION_SUCCESS,
	SET_NOTIFICATION_TOKEN,
	SYNC_SECTIONS_SUCCESS,
} from "../actions/types";

const INITIAL_STATE = {
	TrackedSections: [],
};

export default function TrackedCoursesReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case SET_NOTIFICATION_TOKEN:
			return { ...state, notificationToken: action.payload };
		case TRACK_SECTION_SUCCESS:
			//console.log(action.payload);
			return {
				...state,
				TrackedSections: [...state.TrackedSections, action.payload],
			};
		case SYNC_SECTIONS_SUCCESS:
			//console.log(action.payload);
			return {
				...state,
				TrackedSections: [...state.TrackedSections, ...action.payload],
			};
		default:
			return state;
	}
}
