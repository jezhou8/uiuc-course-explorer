import React from "react";
import { Provider } from "react-redux";
import { AsyncStorage } from "react-native";

import persistStore from "./redux/store";
import TabNavigator from "./components/Navigator/TabNavigator";
import { AppLoading } from "expo";
import { PersistGate } from "redux-persist/integration/react";

export default class App extends React.Component {
	render() {
		const { store, persistor } = persistStore();
		return (
			<Provider store={store}>
				<PersistGate loading={<AppLoading />} persistor={persistor}>
					<TabNavigator></TabNavigator>
				</PersistGate>
			</Provider>
		);
	}
}
