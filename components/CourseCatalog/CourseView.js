import React from "react";
import { StyleSheet, Text, View, ListView, ScrollView } from "react-native";
import { SearchBar } from "react-native-elements";
import { firestore } from "../../firebase/app";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-safe-area-view";

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
			search,
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
						<Text style={styles.itemtext}>
							{course["Subject"] +
								" " +
								course["Number"] +
								": " +
								course["CourseTitle"]}
						</Text>

						<Text>
							{"Average GPA: " + course["AverageGPA"].toFixed(2)}
						</Text>
					</View>
				</TouchableOpacity>
			);
		});
	};

	_getCourses = search => {
		if (search != null) {
			let courseTitle = search.replace(/[^a-z]/gi, "");
			if (courseTitle != null) {
				courseTitle = courseTitle.toUpperCase();
			} else {
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
			ref.where("Subject", "==", courseTitle)
				.where("Number", ">=", courseNumber)
				.limit(20)
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
				<ScrollView style={{ width: "100%" }}>
					{this.state.numCourses == 20 && this._listBuilder()}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		top: getStatusBarHeight(),
		backgroundColor: "#ddd",
		alignItems: "center",
	},
	courseItemContainer: {
		width: "95%",
		margin: "2%",
		backgroundColor: "#0f0",
	},
	itemtext: {
		fontSize: 16,
	},
});
