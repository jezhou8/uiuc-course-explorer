import { connect } from "react-redux";
import CourseView from "./CourseView";
import { getCourse, trackSection } from "../../redux/actions";

const mapStateToProps = state => ({
	cachedCourses: state.cachedCourses,
	displayedCourse: state.displayedCourse,
	user: state.user,
});

const mapDispatchToProps = dispatch => {
	return {
		getCurrentCourse: (section, number) =>
			dispatch(getCourse(section, number)),
		trackSection: (section, token) =>
			dispatch(trackSection(section, token)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseView);
