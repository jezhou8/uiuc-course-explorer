import { connect } from "react-redux";
import { trackSection, untrackSection } from "../../redux/actions";
import { CourseInfoOverlay } from "./CourseInfoOverlay";

const mapStateToProps = state => ({
	cachedCourses: state.cachedCourses,
	displayedCourse: state.displayedCourse,
	user: state.user,
});

const mapDispatchToProps = dispatch => {
	return {
		// createEvent: newForm => dispatch(createEvent(newForm)),
		// onFormDataChange: values => dispatch(onFormDataChange(values)),
		// clearForm: () => dispatch(clearForm()),
		trackSection: (section, token) =>
			dispatch(trackSection(section, token)),
		untrackSection: (section, token) =>
			dispatch(untrackSection(section, token)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseInfoOverlay);
