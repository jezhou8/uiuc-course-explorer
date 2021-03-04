import React from "react";
import {
	Text,
	SafeAreaView,
	RefreshControl,
	View,
	ScrollView,
} from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { firestore } from "../../firebase/app";
import { getStatusBarHeight } from "react-native-safe-area-view";
import { getTitleBySectionObject, DEBUG_LOG } from "../../utility/Common";
import { getColorByEnrollmentStatus } from "../../utility/Colors";
import Constants from "expo-constants";

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
		if (Constants.isDevice) {
			const {
				status: existingStatus,
			} = await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;
			if (existingStatus !== "granted") {
				const {
					status,
				} = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}
			if (finalStatus !== "granted") {
				alert("Failed to get push token for push notification!");
				return;
			}
			const token = (await Notifications.getExpoPushTokenAsync()).data;
			DEBUG_LOG("user notification token: " + token);

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
		} else {
			alert("Must use physical device for Push Notifications");
		}

		if (Platform.OS === "android") {
			Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}
	};

	render() {
		let { user } = this.props;

		return (
			<SafeAreaView
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
						{Object.keys(user["TrackedSections"]).map((key) => {
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
			</SafeAreaView>
		);
	}
}
