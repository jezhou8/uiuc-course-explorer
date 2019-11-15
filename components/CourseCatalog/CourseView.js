import React from "react";
import { StyleSheet, Text, View, ListView, ScrollView } from "react-native";
import { SearchBar } from "react-native-elements";
import { firestore } from "../../firebase/app";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-safe-area-view";
import { getColorByGPA } from "../../utility/Colors";

export default class CoursesView extends React.Component {
	state = {
		search: "",
		courses: [],
		uniqueCourses: [],
		numCourses: 0,
		searchDelay: 0,
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
			return (
				<TouchableOpacity
					style={styles.courseItemContainer}
					key={index}
					onPress={() => {
						this.props.getCurrentCourse(
							course["Subject"],
							course["Number"]
						);
						this.props.navigation.navigate("Track");
					}}
				>
					<View>
						<Text style={styles.itemText}>
							{course["Subject"] +
								" " +
								course["Number"] +
								": " +
								course["CourseTitle"]}
						</Text>

						<View
							style={{
								backgroundColor: getColorByGPA(
									course["AverageGPA"]
								),
							}}
						>
							<Text>
								{"Average GPA: " +
									course["AverageGPA"].toFixed(2)}
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
					.limit(20)
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
				<SearchBar
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
	container: {
		width: "100%",
		height: "100%",
		top: getStatusBarHeight(),
		backgroundColor: "#ddd",
		alignItems: "center",
	},
	courseItemContainer: {
		width: "100%",
		height: 50,
		marginTop: "2%",
		marginBottom: "2%",
		borderRadius: 12,
	},
});
