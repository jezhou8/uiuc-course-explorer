import { combineReducers } from "redux";
import cachedCourses from "./FirebaseReducer";
import displayedCourse from "./CisReducer";
import user from "./TrackingReducer";

const rootReducer = combineReducers({
	cachedCourses,
	displayedCourse,
	user,
});

export default rootReducer;
