import {
	TRACK_SECTION_SUCCESS,
	SET_NOTIFICATION_TOKEN,
	SYNC_SECTIONS_SUCCESS,
	SYNC_SECTIONS,
	UNTRACK_SECTION_SUCCESS,
} from "../actions/types";
import _ from "lodash";

const INITIAL_STATE = {
	TrackedSections: {},
	refreshing: false,
};

export default function TrackedCoursesReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case SET_NOTIFICATION_TOKEN:
			return { ...state, NotificationToken: action.payload };
		case TRACK_SECTION_SUCCESS:
			return {
				...state,
				TrackedSections: {
					...state.TrackedSections,
					...action.payload,
				},
			};
		case UNTRACK_SECTION_SUCCESS:
			return {
				...state,
				TrackedSections: _.omit(state.TrackedSections, action.payload),
			};
		case SYNC_SECTIONS_SUCCESS:
			return {
				...state,
				TrackedSections: { ...action.payload },
				refreshing: false,
			};
		case SYNC_SECTIONS:
			return {
				...state,
				refreshing: true,
			};
		default:
			return state;
	}
}
