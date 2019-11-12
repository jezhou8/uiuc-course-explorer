import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../reducers";

const store = createStore(
	rootReducer, //custom reducers
	applyMiddleware(
		//all middlewares
		thunk //second parameter options can optionally contain onSuccess, onError, onComplete, successSuffix, errorSuffix
	)
);

export default store;
