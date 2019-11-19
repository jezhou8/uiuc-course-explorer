import React from "react";
import {
	StyleSheet,
	Text,
	View,
	ListView,
	ScrollView,
	Dimensions,
} from "react-native";
import { SearchBar, Overlay } from "react-native-elements";
//import Overlay from "react-native-modal-overlay";
import { firestore } from "../../firebase/app";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-safe-area-view";
import {
	getColorByGPA,
	SELECTED_COLOR,
	DEFAULT_COLOR,
} from "../../utility/Colors";
import { CourseDetails } from "./CourseDetails";
import { CourseHeader } from "./CourseHeader";
import { CourseStats } from "./CourseStats";

export class CourseInfoOverlay extends React.Component {
	state = {
		displayOption: "details",
		colors: { details: SELECTED_COLOR, stats: DEFAULT_COLOR },
	};

	_setOpt = opt => {
		if (opt == "details") {
			this.setState({
				displayOption: opt,
				colors: {
					details: SELECTED_COLOR,
					stats: DEFAULT_COLOR,
				},
			});
		} else if (opt == "stats") {
			this.setState({
				displayOption: opt,
				colors: {
					details: DEFAULT_COLOR,
					stats: SELECTED_COLOR,
				},
			});
		}
	};

	render() {
		let {
			displayedCourse,
			additionalCourseInfo,
			user,
			trackSection,
		} = this.props;

		return (
			<View style={styles.container}>
				<CourseHeader
					displayedCourse={additionalCourseInfo}
				></CourseHeader>
				<View
					style={{
						width: "100%",
						height: "7%",
						flexDirection: "row",
					}}
				>
					<View
						style={{
							width: "50%",
						}}
					>
						<TouchableOpacity
							style={{
								...styles.fill,
								backgroundColor: this.state.colors.details,
							}}
							onPress={() => this._setOpt("details")}
						>
							<Text>Overview</Text>
						</TouchableOpacity>
					</View>

					<View
						style={{
							width: "49.5%",
						}}
					>
						<TouchableOpacity
							style={{
								...styles.fill,
								backgroundColor: this.state.colors.stats,
							}}
							onPress={() => this._setOpt("stats")}
						>
							<Text>Stats</Text>
						</TouchableOpacity>
					</View>
				</View>
				{displayedCourse.loading == false && (
					<View
						style={{
							width: "100%",
							height: "83%",
						}}
					>
						{this.state.displayOption == "details" && (
							<CourseDetails
								displayedCourse={displayedCourse}
								courseSubject={additionalCourseInfo["Subject"]}
								courseNumber={additionalCourseInfo["Number"]}
								user={user}
								trackSection={trackSection}
							></CourseDetails>
						)}
						{this.state.displayOption == "stats" && (
							<CourseStats></CourseStats>
						)}
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	averageGPAText: {
		fontSize: 30,
		fontWeight: "bold",
	},
	container: {
		width: "100%",
		height: "100%",
		backgroundColor: "#fff",
		//alignItems: "center",
	},
	courseDetailsContainer: {
		width: "100%",
		height: "100%",
		flexDirection: "row",
		justifyContent: "space-between",

		paddingLeft: 10,
	},
	courseItemContainer: {
		width: "100%",
		backgroundColor: "#fff",
		height: 70,
	},
	gpaContainer: {
		alignItems: "center",
		justifyContent: "center",
		aspectRatio: 1,
		height: "100%",
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
	fill: {
		width: "100%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
	},
});
