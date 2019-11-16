import React from "react";
import { Provider } from "react-redux";
//import AsyncStorage from "@react-native-community/async-storage";
// import { persistStore } from "redux-persist";
import store from "./redux/store";
import TabNavigator from "./components/Navigator/TabNavigator";
import { AppLoading } from "expo";

export default class App extends React.Component {
	state = {
		isLoading: false,
	};

	// componentDidMount() {
	// 	persistStore(
	// 		store,
	// 		{ storage: AsyncStorage, whitelist: ["trackedCourses"] },
	// 		() => this.setState({ isLoading: false })
	// 	);
	// }
	render() {
		if (this.state.isLoading) {
			return <AppLoading></AppLoading>;
		}
		return (
			<Provider store={store}>
				<TabNavigator></TabNavigator>
			</Provider>
		);
	}
}
