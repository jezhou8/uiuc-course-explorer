import React from "react";
import { StyleSheet, Text, View, ListView, ScrollView } from "react-native";
import { SearchBar } from "react-native-elements";
import { firestore } from "../../firebase/app";

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
		const uniqueCourses = [
			...new Set(
				this.state.courses.map(course => course["Course Title"])
			),
		];

		return uniqueCourses.map((course, index) => {
			return (
				<View key={index}>
					<Text style={styles.itemtext}>{course}</Text>
				</View>
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

			console.log("course title: " + courseTitle);
			console.log("course number: " + courseNumber);
			const ref = firestore.collection("courses");
			ref.where("Subject", "==", courseTitle)
				.where("Number", ">=", courseNumber)
				.limit(5)
				.get()
				.then(querySnapshot => {
					querySnapshot.forEach(doc => {
						console.log("request");
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
		const { displayedCourse } = this.props;
		return (
			<View style={styles.container}>
				{displayedCourse.description != null && (
					<View style={styles.container2}>
						<Text>{displayedCourse.description}</Text>
					</View>
				)}
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
