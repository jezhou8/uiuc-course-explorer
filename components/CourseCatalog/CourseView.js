import React from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import { SearchBar, Overlay } from "react-native-elements";
//import Overlay from "react-native-modal-overlay";
import { firestore } from "../../firebase/app";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-safe-area-view";
import { getColorByGPA } from "../../utility/Colors";
import CourseOverlay from "../CourseOverlay/";
// import { SafeAreaView } from "react-navigation";

export default class CoursesView extends React.Component {
	state = {
		search: "",
		courses: [],
		numCourses: 0,
		searchDelay: 0,
		additionalCourseInfo: {},
		displayOption: "details",
		overlayIsVisible: false,
	};

	updateSearch = search => {
		if (this.state.searchDelay) {
			clearTimeout(this.state.searchDelay);
		}
		this.setState({
			...this.state,
			search: search,
			searchDelay: setTimeout(() => {
				this.setState(
					{ ...this.state, numCourses: 0, courses: [] },
					this._getCourses(search)
				);
			}, 300),
		});
	};

	_listBuilder = () => {
		return this.state.courses.map((course, index) => {
			gpaColors = getColorByGPA(course["AverageGPA"]);
			return (
				<TouchableOpacity
					style={styles.courseItemContainer}
					key={index}
					onPress={() => {
						this.props.getCurrentCourse(
							course["Subject"],
							course["Number"]
						);
						this.setState({
							...this.state,
							additionalCourseInfo: {
								Subject: course["Subject"],
								Number: course["Number"],
								CourseTitle: course["CourseTitle"],
							},
							overlayIsVisible: true,
						});
					}}
				>
					<SafeAreaView style={styles.courseDetailsContainer}>
						<View
							style={{
								flex: 1,
								flexDirection: "column",
								justifyContent: "center",
							}}
						>
							<View>
								<Text style={styles.courseSubjectNumberText}>
									{course["Subject"] + " " + course["Number"]}
								</Text>
								<Text style={styles.courseTitleText}>
									{course["CourseTitle"]}
								</Text>
							</View>
						</View>
						<View
							style={{
								...styles.gpaContainer,
								backgroundColor: gpaColors["backgroundColor"],
							}}
						>
							<Text
								style={{
									...styles.averageGPAText,
									color: gpaColors["textColor"],
								}}
							>
								{course["AverageGPA"].toFixed(2)}
							</Text>
						</View>
					</SafeAreaView>
				</TouchableOpacity>
			);
		});
	};

	_getCourses = search => {
		if (search != null) {
			let courseTitle = search.replace(/[^a-z|^ ]/gi, "");
			if (courseTitle == null) {
				courseTitle = "";
			}

			let courseNumber = search.match(/\d/g);
			if (courseNumber != null) {
				courseNumber = parseInt(courseNumber.join(""));
				if (courseNumber < 10) {
					courseNumber *= 100;
				} else if (courseNumber < 50) {
					courseNumber *= 10;
				}
			} else {
				courseNumber = 0;
			}

			const ref = firestore.collection("courses");
			// if length of input is less than 5, search for subject, otherwise search course title
			let courseTitleNoSpace = courseTitle.replace(" ", "");
			if (courseTitleNoSpace.length < 5) {
				courseTitle = courseTitle.replace(" ", "");
				courseTitle = courseTitle.toUpperCase();

				ref.where("Subject", "==", courseTitle)
					.where("Number", ">=", courseNumber)
					.limit(10)
					.get()
					.then(querySnapshot => {
						querySnapshot.forEach(doc => {
							let courseInfo = doc.data();
							let tempcourses = this.state.courses;
							tempcourses.push(courseInfo);
							this.setState({
								...this.state,
								courses: tempcourses,
							});
						});

						this.setState({
							...this.state,
							numCourses: 20,
						});
					});
			} else {
				let temp_arr = courseTitle.split(" ");
				for (let i = 0; i < temp_arr.length; i++) {
					if (temp_arr[i].length < 4 && i != 0) {
						temp_arr[i] = temp_arr[i].toLowerCase();
						continue;
					}
					temp_arr[i] =
						temp_arr[i].charAt(0).toUpperCase() +
						temp_arr[i].slice(1).toLowerCase();
				}
				courseTitle = temp_arr.join(" ");
				let end_str = courseTitle + "\uf8ff";
				ref.orderBy("CourseTitle")
					.startAt(courseTitle)
					.endAt(end_str)
					.get()
					.then(querySnapshot => {
						querySnapshot.forEach(doc => {
							let courseInfo = doc.data();
							this.state.courses.push(courseInfo);
						});

						this.setState({
							...this.state,
							numCourses: 20,
						});
					});
			}
		}
	};

	render() {
		const { search } = this.state;
		let { displayedCourse, user, trackSection } = this.props;
		return (
			<SafeAreaView style={styles.container}>
				<Overlay
					isVisible={this.state.overlayIsVisible}
					overlayStyle={{ width: "90%", height: "90%", padding: 0 }}
					onBackdropPress={() => {
						this.setState({ overlayIsVisible: false });
					}}
				>
					<CourseOverlay
						additionalCourseInfo={this.state.additionalCourseInfo}
					></CourseOverlay>
				</Overlay>

				<SearchBar
					lightTheme
					placeholder="Search For courses.."
					onChangeText={this.updateSearch}
					containerStyle={{ width: "100%" }}
					value={search}
				/>
				<ScrollView
					style={{
						width: "100%",
						height: "100%",
					}}
				>
					{this.state.numCourses == 20 && this._listBuilder()}
				</ScrollView>
			</SafeAreaView>
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
