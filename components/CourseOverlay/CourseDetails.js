import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SectionLabel } from "./SectionLabel";

export class CourseDetails extends React.Component {
	state = {
		search: "",
		courses: [],
		numCourses: 0,
		searchDelay: 0,
	};

	render() {
		const {
			displayedCourse,
			user,
			trackSection,
			untrackSection,
			courseSubject,
			courseNumber,
		} = this.props;

		return (
			<ScrollView style={styles.container}>
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
				<View style={styles.genEdContainer}>
					{displayedCourse.Description != null &&
						displayedCourse["GenEds"].map((genEd, index) => (
							<View key={index} style={styles.genEdLabel}>
								<Text style={{ color: "#E19500" }}>
									{genEd}
								</Text>
							</View>
						))}
				</View>
				{displayedCourse.error == null && (
					<Text
						style={{
							fontSize: 16,
							fontWeight: "bold",
							color: "#666666",
							paddingLeft: 10,
						}}
					>
						Sections available for Spring 2020
					</Text>
				)}
				{displayedCourse.Description != null &&
					displayedCourse.Sections.map((section, index) => {
						let key =
							"" +
							courseSubject +
							courseNumber +
							section["SectionId"];
						return (
							<SectionLabel
								key={index}
								section={section}
								userToken={user["NotificationToken"]}
								trackSection={trackSection}
								untrackSection={untrackSection}
								courseSubject={courseSubject}
								courseNumber={courseNumber}
								tracked={key in user["TrackedSections"]}
							></SectionLabel>
						);
					})}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	container2: {
		marginTop: 5,
		paddingLeft: 10,
		paddingRight: 10,
	},
	genEdContainer: {
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		marginVertical: 10,
	},
	genEdLabel: {
		backgroundColor: "#FFD990",
		borderRadius: 20,
		paddingVertical: 5,
		paddingHorizontal: 10,
		marginVertical: 3,
		flex: 1,
	},
	gridView: {
		flex: 1,
	},
	sectionContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		padding: 7,
		borderRadius: 12,
	},
	trackButton: {
		backgroundColor: "#f00",
		borderRadius: 20,
		padding: 5,
	},
	itemtext: {
		fontSize: 16,
	},
});
