import React from "react";
import {
	StyleSheet,
	Text,
	View,
	ListView,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { firestore } from "../../firebase/app";
import { getStatusBarHeight } from "react-native-safe-area-view";
import {
	getColorByGPA,
	getColorByEnrollmentStatus,
} from "../../utility/Colors";
import { FlatGrid } from "react-native-super-grid";

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
			courseSubject,
			courseNumber,
		} = this.props;
		//console.log(displayedCourse["Sections"]);
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

				{displayedCourse.Description != null && (
					<FlatGrid
						itemDimension={130}
						items={displayedCourse["Sections"]}
						style={styles.gridView}
						// staticDimension={300}
						// fixed
						// spacing={20}
						scrollEnabled={false}
						renderItem={({ item, index }) => {
							let statusColor = {
								backgroundColor: getColorByEnrollmentStatus(
									item["EnrollmentStatus"]
								),
							};
							return (
								<TouchableOpacity
									key={index}
									style={{
										...styles.sectionContainer,
										...statusColor,
									}}
									onPress={() =>
										trackSection(
											{
												Subject: courseSubject,
												Number: courseNumber,
												SectionNumber:
													item["SectionNumber"],
												SectionId: item["SectionId"],
												EnrollmentStatus:
													item["EnrollmentStatus"],
											},
											user["notificationToken"]
										)
									}
								>
									<Text>{item["SectionId"]}</Text>
								</TouchableOpacity>
							);
						}}
					/>
				)}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		overflow: "scroll",
	},
	genEdContainer: {
		borderRadius: 5,
		padding: 5,
		margin: 5,
		backgroundColor: "#ec9b3b",
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
