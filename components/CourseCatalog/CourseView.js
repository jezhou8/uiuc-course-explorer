import React from "react";
import { StyleSheet, Text, View, ListView, ScrollView } from "react-native";
import { SearchBar } from "react-native-elements";
import { firestore } from "../../firebase/app";
import { TouchableOpacity } from "react-native-gesture-handler";

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
					{ ...this.state, courses: [] },
					this._getCourses(search)
				);
			}, 300),
		});
	};

	_listBuilder = () => {
		console.log(this.state.courses.length);
		const courseTitles = {};
		const uniqueCourses = [];
		for (let i = 0; i < this.state.courses.length; i++) {
			let course = this.state.courses[i];
			if (!(course["Course Title"] in courseTitles)) {
				courseTitles[course["Course Title"]] = true;
				uniqueCourses.push(course);
			}
		}

		return this.state.courses.map((course, index) => {
			return (
				<TouchableOpacity
					style={{ backgroundColor: "#f00" }}
					key={index}
					onPress={() =>
						this.props.getCurrentCourse(
							course["Subject"],
							course["Number"]
						)
					}
				>
					<Text style={styles.itemtext}>
						{course["Subject"] +
							" " +
							course["Number"] +
							": " +
							course["Course Title"]}
					</Text>
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
			} else {
				courseNumber = 0;
			}

			const ref = firestore.collection("courses");
			ref.where("Subject", "==", courseTitle)
				.where("Number", ">=", courseNumber)
				.limit(50)
				.get()
				.then(querySnapshot => {
					querySnapshot.forEach(doc => {
						let courseInfo = doc.data();
						this.state.courses.push(courseInfo);
						this.setState({
							...this.state,
							numCourses: this.state.numCourses + 1,
						});
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
				<ScrollView>
					{this.state.numCourses > 0 && this._listBuilder()}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ddd",
		alignItems: "center",
	},
	itemtext: {
		fontSize: 16,
	},
});
