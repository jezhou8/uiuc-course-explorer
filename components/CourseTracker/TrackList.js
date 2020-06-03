import React from "react";
import {
	Text,
	SafeAreaView,
	RefreshControl,
	View,
	ScrollView,
	AsyncStorage,
} from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { firestore } from "../../firebase/app";
import { getStatusBarHeight } from "react-native-safe-area-view";
import { getTitleBySectionObject, DEBUG_LOG } from "../../utility/Common";
import { getColorByEnrollmentStatus } from "../../utility/Colors";

export class TrackList extends React.Component {
	componentDidMount() {
		if (this.props.user.NotificationToken == null) {
			this.registerForPushNotificationsAsync();
		} else {
			this.props.syncSections(this.props.user.NotificationToken);
		}
	}

	registerForPushNotificationsAsync = async () => {
		DEBUG_LOG("fetching token...");
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
		let { user } = this.props;

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
				{"NotificationToken" in this.props.user && (
					<Text>{this.props.user["NotificationToken"]}</Text>
				)}
				<Text
					style={{ color: "red", fontSize: 20 }}
					onPress={() => {
						alert("Purging!");
						AsyncStorage.removeItem("persist:root");
					}}
				>
					PURGE LOCAL STORAGE
				</Text>

				<SafeAreaView style={{ flex: 1 }}>
					<ScrollView
						style={{
							flex: 1,
						}}
						refreshControl={
							<RefreshControl
								refreshing={this.props.user.refreshing}
								onRefresh={() =>
									this.props.syncSections(
										this.props.user.NotificationToken
									)
								}
							/>
						}
					>
						{Object.keys(user["TrackedSections"]).map(key => {
							let section = user["TrackedSections"][key];
							return (
								<View
									style={{
										flex: 1,
										margin: 2,
										backgroundColor: getColorByEnrollmentStatus(
											section["EnrollmentStatus"]
										),
									}}
									key={key}
								>
									<Text>
										{getTitleBySectionObject(section)}
									</Text>
								</View>
							);
						})}
					</ScrollView>
				</SafeAreaView>
			</View>
		);
	}
}
