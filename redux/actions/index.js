import {
	GET_CURRENT_COURSE_FAILED,
	GET_CURRENT_COURSE,
	GET_CURRENT_COURSE_SUCCESS,
} from "./types";

import { parse } from "fast-xml-parser";
import axios from "axios";
import { parseJsonFromXml } from "../../utility/Parser";

const YEAR = 2020;
const SEASON = "spring";

export function getCourse(title, number) {
	const url = `http://courses.illinois.edu/cisapp/explorer/schedule/${YEAR}/${SEASON}/${title}/${number}.xml?mode=cascade`;
	return dispatch => {
		axios
			.get(url)
			.then(res => dispatch(getCourseSuccess(res.data)))
			.catch(err => {
				dispatch(getCourseFailure(err.message));
			});
	};
}

const getCourseSuccess = courseXml => {
	let courseJson = parseJsonFromXml(courseXml);

	return {
		type: GET_CURRENT_COURSE_SUCCESS,
		payload: {
			...courseJson,
		},
	};
};

const getCourseStarted = () => ({
	type: GET_CURRENT_COURSE_SUCCESS,
});

const getCourseFailure = error => ({
	type: GET_CURRENT_COURSE_FAILED,
	payload: {
		error,
	},
});
