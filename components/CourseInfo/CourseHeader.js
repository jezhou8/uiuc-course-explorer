import React from "react";
import { StyleSheet, Text, View, ListView, ScrollView } from "react-native";
import { SearchBar } from "react-native-elements";
import { firestore } from "../../firebase/app";
import {
	getColorByGPA,
	getColorByEnrollmentStatus,
} from "../../utility/Colors";

export class CourseHeader extends React.Component {
	state = {
		search: "",
		courses: [],
		numCourses: 0,
		searchDelay: 0,
	};

	render() {
		const { displayedCourse } = this.props;
		return (
			<View style={styles.container}>
				<Text style={styles.courseSubjectNumberText}>
					{displayedCourse["Subject"] +
						" " +
						displayedCourse["Number"]}
				</Text>
				<Text style={styles.courseTitleText}>
					{displayedCourse["CourseTitle"]}
				</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "10%",
		backgroundColor: "#ddd",
		alignItems: "center",
	},
	genEdContainer: {
		borderWidth: 1,
		borderRadius: 12,
		padding: 5,
		margin: 5,
	},
	sectionContainer: {},
	itemtext: {
		fontSize: 16,
	},
	courseSubjectNumberText: {
		color: "#707070",
		fontWeight: "bold",
		fontSize: 20,
	},
	courseTitleText: {
		color: "#707070",
		fontSize: 18,
	},
});
