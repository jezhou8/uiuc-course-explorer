import { connect } from "react-redux";
import { TrackList } from "./TrackList";
import { setNotificationToken, syncSections } from "../../redux/actions";

const mapStateToProps = state => ({
	user: state.user,
	TrackedSections: state.user.TrackedSections,
});

const mapDispatchToProps = dispatch => {
	return {
		// createEvent: newForm => dispatch(createEvent(newForm)),
		// onFormDataChange: values => dispatch(onFormDataChange(values)),
		// clearForm: () => dispatch(clearForm()),
		setNotificationToken: token => dispatch(setNotificationToken(token)),
		syncSections: token => dispatch(syncSections(token)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackList);
