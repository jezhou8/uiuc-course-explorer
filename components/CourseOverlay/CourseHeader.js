import React from "react";
import { StyleSheet, Text, View, ListView, ScrollView } from "react-native";
import { SearchBar } from "react-native-elements";
import { firestore } from "../../firebase/app";
import {
	getColorByGPA,
	getColorByEnrollmentStatus,
} from "../../utility/Colors";

export class CourseHeader extends React.Component {
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
		alignItems: "center",
		justifyContent: "center",
	},
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
