import React from "react";
import { StyleSheet, Text, View, ListView, ScrollView } from "react-native";
import { SearchBar } from "react-native-elements";
import { firestore } from "../../firebase/app";
import { getStatusBarHeight } from "react-native-safe-area-view";

export default class CoursesView extends React.Component {
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
				{displayedCourse.description != null && (
					<View style={styles.container2}>
						<Text>{displayedCourse.description}</Text>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		top: getStatusBarHeight(),
		backgroundColor: "#ddd",
		alignItems: "center",
	},
	itemtext: {
		fontSize: 16,
	},
});
