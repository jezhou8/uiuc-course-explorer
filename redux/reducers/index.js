import { combineReducers } from "redux";
import cachedCourses from "./FirebaseReducer";
import displayedCourse from "./CisReducer";

const rootReducer = combineReducers({
	cachedCourses,
	displayedCourse,
});

export default rootReducer;
