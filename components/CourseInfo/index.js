import { connect } from "react-redux";
import CourseInfo from "./CourseInfo";

const mapStateToProps = state => ({
	displayedCourse: state.displayedCourse,
});

const mapDispatchToProps = dispatch => {
	return {
		// createEvent: newForm => dispatch(createEvent(newForm)),
		// onFormDataChange: values => dispatch(onFormDataChange(values)),
		// clearForm: () => dispatch(clearForm()),
	};
};

export default connect(mapStateToProps)(CourseInfo);
