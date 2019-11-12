import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import TabNavigator from "./components/Navigator/TabNavigator";

export default function App() {
	return (
		<Provider store={store}>
			<TabNavigator></TabNavigator>
		</Provider>
	);
}
