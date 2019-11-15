import React from "react";
import {
	StyleSheet,
	Text,
	View,
	ListView,
	ScrollView,
	Dimensions,
} from "react-native";
import { SearchBar } from "react-native-elements";
import Overlay from "react-native-modal-overlay";
import { firestore } from "../../firebase/app";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-safe-area-view";
import { getColorByGPA } from "../../utility/Colors";
import { Row, Col } from "react-native-easy-grid";
import { createKeyboardAwareNavigator } from "react-navigation";
import { LineChart } from "react-native-chart-kit";

export default class CoursesView extends React.Component {
	state = {
		search: "",
		courses: [],
		numCourses: 0,
		searchDelay: 0,
		displayedCourse: {},
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
						//this.props.navigation.navigate("Track");
						this.setState({
							...this.state,
							displayedCourse: course,
							overlayIsVisible: true,
						});
					}}
				>
					<View style={styles.courseDetailsContainer}>
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
					</View>
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
		let { cachedCourses } = this.props;

		return (
			<View style={styles.container}>
				<Overlay
					visible={this.state.overlayIsVisible}
					animationDuration={100}
					onClose={() =>
						this.setState({
							...this.state,
							overlayIsVisible: false,
						})
					}
					containerStyle={{
						alignItems: "center",
						justifyContent: "center",
					}}
					childrenWrapperStyle={{ width: "95%", height: "90%" }}
					closeOnTouchOutside
				>
					<LineChart
						data={{
							labels: [
								"January",
								"February",
								"March",
								"April",
								"May",
								"June",
							],
							datasets: [
								{
									data: [
										Math.random() * 100,
										Math.random() * 100,
										Math.random() * 100,
										Math.random() * 100,
										Math.random() * 100,
										Math.random() * 100,
									],
								},
							],
						}}
						width={300} // from react-native
						height={150}
						yAxisLabel={"$"}
						chartConfig={{
							backgroundColor: "#fff",
							decimalPlaces: 2, // optional, defaults to 2dp
							color: (opacity = 1) =>
								`rgba(255, 255, 255, ${opacity})`,
							labelColor: (opacity = 1) =>
								`rgba(255, 255, 255, ${opacity})`,
							style: {
								borderRadius: 5,
							},
							propsForDots: {
								r: "6",
								strokeWidth: "2",
								stroke: "#ffa726",
							},
						}}
						bezier
						style={{
							marginVertical: 8,
							borderRadius: 5,
						}}
					/>
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
		top: getStatusBarHeight(),
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
});
