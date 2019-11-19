import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SearchBar } from "react-native-elements";
import { firestore } from "../../firebase/app";
import {
	getColorByGPA,
	getColorByEnrollmentStatus,
} from "../../utility/Colors";
import { parseStatusFromString } from "../../utility/Parser";

export class SectionLabel extends React.Component {
	render() {
		const {
			section,
			trackSection,
			userToken,
			courseNumber,
			courseSubject,
			tracked,
		} = this.props;
		let statusColor = {
			backgroundColor: getColorByEnrollmentStatus(
				section["EnrollmentStatus"]
			),
		};
		return (
			<View
				style={{
					...styles.sectionContainer,
				}}
			>
				<View style={styles.sectionTextContainer}>
					<View style={styles.statusContainer}>
						<View
							style={{ ...styles.statusLight, ...statusColor }}
						/>
						<Text style={{ fontSize: 18 }}>
							{section["SectionId"]}
						</Text>
					</View>
					<Text style={{ fontSize: 14 }}>
						{"Status: " +
							parseStatusFromString(section["EnrollmentStatus"])}
					</Text>
				</View>

				{!tracked ? (
					<TouchableOpacity
						style={styles.trackButton}
						onPress={() =>
							trackSection(
								{
									Subject: courseSubject,
									Number: courseNumber,
									SectionNumber: section["SectionNumber"],
									SectionId: section["SectionId"],
									EnrollmentStatus:
										section["EnrollmentStatus"],
								},
								userToken
							)
						}
					>
						<Text style={{ fontSize: 16, color: "#477f91" }}>
							Track
						</Text>
					</TouchableOpacity>
				) : (
					<View style={styles.isTrackingButton}>
						<Text style={{ fontSize: 16, color: "#BBB" }}>
							Tracking
						</Text>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	statusLight: {
		width: 12,
		height: 12,
		marginRight: 10,
		borderRadius: 12 / 2,
	},
	statusContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	gridView: {
		flex: 1,
	},

	sectionContainer: {
		flexDirection: "row",
		backgroundColor: "#F5F5F5",
		padding: 7,
		paddingLeft: 10,
		borderRadius: 10,
		marginVertical: 5,
		width: "90%",
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "space-between",
	},
	sectionTextContainer: {
		flexDirection: "column",
	},
	trackButton: {
		backgroundColor: "#ADD8E6",
		borderRadius: 20,
		paddingHorizontal: 10,
		paddingVertical: 2,
		marginRight: 10,
	},
	isTrackingButton: {
		backgroundColor: "#DDD",
		borderRadius: 20,
		paddingHorizontal: 10,
		paddingVertical: 2,
		marginRight: 10,
	},

	itemtext: {
		fontSize: 16,
	},
});
