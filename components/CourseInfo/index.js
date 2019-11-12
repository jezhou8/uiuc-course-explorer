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
		findStopsNearLatLong: (lat, long, count = 5) =>
			dispatch(findStopsNearLatLong(lat, long, count)),
		findStopTimesByStopId: stop_id =>
			dispatch(findStopTimesByStopId(stop_id)),
	};
};

export default connect(mapStateToProps)(CourseInfo);
