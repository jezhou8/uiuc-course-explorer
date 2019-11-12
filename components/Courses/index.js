import React from "react";
import { StyleSheet, Text, View, ListView, ScrollView } from "react-native";
import { SearchBar } from "react-native-elements";
import { firestore } from "../../firebase/app";

export default class CoursesView extends React.Component {
	state = {
		search: "",
		courses: {},
		numCourses: 0,
	};

	updateSearch = search => {
		this.setState({ search });
	};

	listBuilder = () => {
		let list = [];
		if (this.state.numCourses > 0) {
			this.state.courses.forEach(course => {
				list.push(
					<View key={1}>
						<Text style={styles.itemtext}>{"hello!"}</Text>
					</View>
				);
			});
		}
		console.log("Hello!");
		console.log(list);
		return list;
	};

	getCourses = () => {
		const ref = firestore.collection("courses");
		let tempList = {};
		ref.where("Number", "==", 100)
			.limit(5)
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					let courseInfo = doc.data();
					let key = courseInfo["Subject"] + courseInfo["Number"];
					if (!(key in this.state.courses)) {
						this.state.courses[key] = courseInfo;
					}
				});
				this.state.numCourses = 1;
				console.log(this.state.courses);
			});
	};

	componentDidMount() {
		this.getCourses();
	}

	render() {
		const { search } = this.state;

		return (
			<View style={styles.container}>
				<SearchBar
					placeholder="Search For courses.."
					onChangeText={this.updateSearch}
					containerStyle={{ width: "100%" }}
					value={search}
				/>
				<ScrollView>
					{this.state.numCourses != 0 && this.listBuilder()}
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
