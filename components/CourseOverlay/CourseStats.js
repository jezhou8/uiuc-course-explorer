import React, { Component } from "react";
import Accordion from "react-native-collapsible/Accordion";
import {
	StyleSheet,
	Text,
	View,
	ListView,
	ScrollView,
	Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { getStatusBarHeight } from "react-native-safe-area-view";
const SECTIONS = [
	{
		title: "First",
		content: "Lorem ipsum...",
	},
	{
		title: "Second",
		content: "Lorem ipsum...",
	},
];

export class CourseStats extends Component {
	state = {
		activeSections: [],
	};

	componentDidMount() {}

	_renderSectionTitle = section => {};

	_renderHeader = section => {
		return (
			<View style={styles.header}>
				<Text style={styles.headerText}>{section.title}</Text>
			</View>
		);
	};

	_renderContent = section => {
		return (
			<View style={styles.content}>
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
					yAxisSuffix={"k"}
					chartConfig={{
						backgroundColor: "#e26a00",
						backgroundGradientFrom: "#fb8c00",
						backgroundGradientTo: "#ffa726",
						decimalPlaces: 2, // optional, defaults to 2dp
						color: (opacity = 1) =>
							`rgba(255, 255, 255, ${opacity})`,
						labelColor: (opacity = 1) =>
							`rgba(255, 255, 255, ${opacity})`,
						style: {
							borderRadius: 16,
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
						borderRadius: 16,
					}}
				/>
			</View>
		);
	};

	_updateSections = activeSections => {
		this.setState({ activeSections });
	};

	render() {
		return (
			<Accordion
				sections={SECTIONS}
				activeSections={this.state.activeSections}
				renderSectionTitle={this._renderSectionTitle}
				renderHeader={this._renderHeader}
				renderContent={this._renderContent}
				onChange={this._updateSections}
			/>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5FCFF",
		paddingTop: getStatusBarHeight(),
	},
	title: {
		textAlign: "center",
		fontSize: 22,
		fontWeight: "300",
		marginBottom: 20,
	},
	header: {
		backgroundColor: "#F5FCFF",
		padding: 10,
	},
	headerText: {
		textAlign: "center",
		fontSize: 16,
		fontWeight: "500",
	},
	content: {
		padding: 20,
		backgroundColor: "#fff",
	},
	active: {
		backgroundColor: "rgba(255,255,255,1)",
	},
	inactive: {
		backgroundColor: "rgba(245,252,255,1)",
	},
	selectors: {
		marginBottom: 10,
		flexDirection: "row",
		justifyContent: "center",
	},
	selector: {
		backgroundColor: "#F5FCFF",
		padding: 10,
	},
	activeSelector: {
		fontWeight: "bold",
	},
	selectTitle: {
		fontSize: 14,
		fontWeight: "500",
		padding: 10,
	},
	multipleToggle: {
		flexDirection: "row",
		justifyContent: "center",
		marginVertical: 30,
		alignItems: "center",
	},
	multipleToggle__title: {
		fontSize: 16,
		marginRight: 8,
	},
});
