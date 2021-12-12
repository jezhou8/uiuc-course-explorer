import {
	GET_CURRENT_COURSE_FAILED,
	GET_CURRENT_COURSE,
	GET_CURRENT_COURSE_SUCCESS,
	TRACK_SECTION_SUCCESS,
	SET_NOTIFICATION_TOKEN,
	SYNC_SECTIONS_SUCCESS,
	SYNC_SECTIONS,
	UNTRACK_SECTION_SUCCESS,
} from "./types";

import { Alert } from "react-native";
import { parse } from "fast-xml-parser";
import axios from "axios";
import { parseJsonFromXml } from "../../utility/Parser";
import { firestore, firestoreRef } from "../../firebase/app";
import {
	hashCode,
	getTitleBySectionObject,
	DEBUG_LOG,
} from "../../utility/Common";
import {
	YEAR, SEASON
} from "../../utility/Consts";
import { cancelAllScheduledNotificationsAsync } from "expo-notifications";

export function getCourse(title, number) {
	const url = `http://courses.illinois.edu/cisapp/explorer/schedule/${YEAR}/${SEASON}/${title}/${number}.xml?mode=cascade`;

	return (dispatch) => {
		dispatch(getCourseStarted());
		axios
			.get(url)
			.then((res) => dispatch(getCourseSuccess(res.data)))
			.catch((err) => {
				DEBUG_LOG(err.message);
				dispatch(getCourseFailure(err.message, title, number));
			});
	};
}

export function getOldCourse(title, number) {
	const url = `http://courses.illinois.edu/cisapp/explorer/schedule/${YEAR}/${SEASON}/${title}/${number}.xml?mode=cascade`;

	return (dispatch) => {
		dispatch(getCourseStarted());
		axios
			.get(url)
			.then((res) => dispatch(getCourseSuccess(res.data)))
			.catch((err) => {
				DEBUG_LOG(err.message);
				dispatch(getCourseFailure(err.message, title, number));
			});
	};
}

const getCourseSuccess = (courseXml) => {
	DEBUG_LOG("Got course!");

	const courseJson = parseJsonFromXml(courseXml);

	return {
		type: GET_CURRENT_COURSE_SUCCESS,
		payload: {
			...courseJson,
		},
	};
};

const getCourseStarted = () => ({
	type: GET_CURRENT_COURSE,
});

const getCourseFailure = (error, subject, number) => ({
	type: GET_CURRENT_COURSE_FAILED,
	payload: {
		error,
		subject,
		number,
	},
});


export function syncSections(token) {
	DEBUG_LOG("syncing...");
	return (dispatch) => {
		dispatch(syncSectionsStarted());
		if (token == null) {
			alert("You must grant Notification Permissions!");
		} else {
			firestore
				.collection("users")
				.doc(token)
				.get()
				.then((doc) => {
					if (!doc.exists) {
						DEBUG_LOG("No such user!");
					} else {
						dispatch(
							syncSectionsSuccess(doc.data().TrackedSections)
						);
					}
				})
				.catch((err) => {
					DEBUG_LOG("Error getting document", err);
				});
		}
	};
}

const syncSectionsSuccess = (sections) => {
	let sectionsMap = {};

	sections.forEach((section) => {
		let key = section["Subject"] + section["Number"] + section["SectionId"];
		sectionsMap[key] = section;
	});

	return {
		type: SYNC_SECTIONS_SUCCESS,
		payload: sectionsMap,
	};
};

const syncSectionsStarted = () => {
	return {
		type: SYNC_SECTIONS,
	};
};




export function untrackSection(section, user) {
	return (dispatch) => {
		const updatedSections = firestoreRef.FieldValue.arrayRemove(section);
		firestore
			.collection("users")
			.doc(user)
			.update({
				TrackedSections: updatedSections,
			})
			.then(function () {
				// add to tracked
				firestore
					.collection("tracked")
					.doc(section.Subject + section.Number + section.SectionId)
					.set(
						{
							Subject: section.Subject,
							Number: section.Number,
							SectionNumber: section.SectionNumber,
							SectionId: section.SectionId,
							EnrollmentStatus: section.EnrollmentStatus,
							Trackers: firestoreRef.FieldValue.increment(-1),
						},
						{ merge: true }
					)
					.then(dispatch(untrackSectionSuccess(section)));
			});
	};
}

export function trackSection(section, user) {
	return (dispatch) => {
		const updatedSections = firestoreRef.FieldValue.arrayUnion(section);
		firestore
			.collection("users")
			.doc(user)
			.update({
				TrackedSections: updatedSections,
			})
			.then(function () {
				// add to tracked
				firestore
					.collection("tracked")
					.doc(section.Subject + section.Number + section.SectionId)
					.set(
						{
							Subject: section.Subject,
							Number: section.Number,
							SectionNumber: section.SectionNumber,
							SectionId: section.SectionId,
							EnrollmentStatus: section.EnrollmentStatus,
							Trackers: firestoreRef.FieldValue.increment(1),
						},
						{ merge: true }
					)
					.then(dispatch(trackSectionSuccess(section)));
			});
	};
}

export const setNotificationToken = (token) => {
	return {
		type: SET_NOTIFICATION_TOKEN,
		payload: token,
	};
};

const trackSectionSuccess = (section) => {
	let sectionMap = {};
	let key = section["Subject"] + section["Number"] + section["SectionId"];
	sectionMap[key] = section;
	return {
		type: TRACK_SECTION_SUCCESS,
		payload: sectionMap,
	};
};

const untrackSectionSuccess = (section) => {
	let key = section["Subject"] + section["Number"] + section["SectionId"];
	return {
		type: UNTRACK_SECTION_SUCCESS,
		payload: key,
	};
};


