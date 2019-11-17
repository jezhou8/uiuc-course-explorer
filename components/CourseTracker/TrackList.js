import React from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { firestore } from "../../firebase/app";
import { getStatusBarHeight } from "react-native-safe-area-view";
import { getTitleBySectionObject } from "../../utility/Common";

export class TrackList extends React.Component {
	state = {
		TrackedSections: [],
	};

	componentDidMount() {
		this.registerForPushNotificationsAsync();
	}

	registerForPushNotificationsAsync = async () => {
		const { status: existingStatus } = await Permissions.getAsync(
			Permissions.NOTIFICATIONS
		);
		let finalStatus = existingStatus;

		// only ask if permissions have not already been determined, because
		// iOS won't necessarily prompt the user a second time.
		if (existingStatus !== "granted") {
			// Android remote notification permissions are granted during the app
			// install, so this will only ask on iOS
			const { status } = await Permissions.askAsync(
				Permissions.NOTIFICATIONS
			);
			finalStatus = status;
		}

		// Stop here if the user did not grant permissions
		if (finalStatus !== "granted") {
			return;
		}

		// Get the token that uniquely identifies this device
		let token = await Notifications.getExpoPushTokenAsync();

		// POST the token to your backend server from where you can retrieve it to send push notifications.
		let date = Date(Date.now());
		firestore
			.collection("users")
			.doc(token)
			.set({ lastLoggedIn: date.toString() }, { merge: true })
			.then(() => {
				this.props.setNotificationToken(token);
				this.props.syncSections(token);
			});
	};

	render() {
		return (
			<View
				style={{
					top: getStatusBarHeight(),
					width: "100%",
					height: "100%",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{"notificationToken" in this.props.user && (
					<Text>{this.props.user["notificationToken"]}</Text>
				)}
				<ScrollView
					style={{
						width: "100%",
						height: "90%",
						backgroundColor: "#f00",
					}}
				>
					{this.props.TrackedSections.map((section, index) => {
						console.log("Section: ", section);
						return (
							<View style={{ flex: 1, margin: 2 }} key={index}>
								<Text>{getTitleBySectionObject(section)}</Text>
							</View>
						);
					})}
				</ScrollView>
			</View>
		);
	}
}
