import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

import { getStatusBarHeight } from "react-native-safe-area-view";
import { getColorByEnrollmentStatus } from "../../utility/Colors";

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
				{displayedCourse.error != null && (
					<Text>
						{displayedCourse.subject +
							" " +
							displayedCourse.number +
							" is not offered during Spring 2020."}
					</Text>
				)}
				{displayedCourse.Description != null && (
					<View style={styles.container2}>
						<Text>{displayedCourse.Description}</Text>
					</View>
				)}
				{displayedCourse.error == null && (
					<Text>Gen Eds Fulfilled</Text>
				)}
				{displayedCourse.Description != null &&
					displayedCourse["GenEds"].map((genEd, index) => (
						<View key={index} style={styles.genEdContainer}>
							<Text>{genEd}</Text>
						</View>
					))}
				{displayedCourse.error == null && <Text>Section Status</Text>}
				<ScrollView>
					{displayedCourse.Description != null &&
						displayedCourse["Sections"].map((section, index) => {
							let statusColor = {
								backgroundColor: getColorByEnrollmentStatus(
									section["EnrollmentStatus"]
								),
							};
							return (
								<View
									key={index}
									style={{
										...styles.sectionContainer,
										...statusColor,
									}}
								>
									<Text>{section["SectionNumber"]}</Text>
								</View>
							);
						})}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		top: getStatusBarHeight(),
		backgroundColor: "#ddd",
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
});
