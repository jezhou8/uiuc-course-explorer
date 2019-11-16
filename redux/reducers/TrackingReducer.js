import {
	TRACK_SECTION_SUCCESS,
	SET_NOTIFICATION_TOKEN,
} from "../actions/types";

const INITIAL_STATE = {
	sections: [],
};

export default function TrackedCoursesReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case SET_NOTIFICATION_TOKEN:
			return { ...state, notificationToken: action.payload };
		case TRACK_SECTION_SUCCESS:
			//console.log(action.payload);
			return {
				...state,
				sections: { ...state.sections, ...action.payload },
			};
		default:
			return state;
	}
}
