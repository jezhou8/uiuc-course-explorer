import { connect } from "react-redux";
import CourseView from "./CourseView";
import { getCourse } from "../../redux/actions";

const mapStateToProps = state => ({
	cachedCourses: state.cachedCourses,
});

const mapDispatchToProps = dispatch => {
	return {
		// createEvent: newForm => dispatch(createEvent(newForm)),
		// onFormDataChange: values => dispatch(onFormDataChange(values)),
		// clearForm: () => dispatch(clearForm()),
		getCurrentCourse: (title, number) => dispatch(getCourse(title, number)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseView);
