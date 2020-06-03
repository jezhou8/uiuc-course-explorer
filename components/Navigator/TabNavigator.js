import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import CourseScreen from "../CourseCatalog";
import CourseInfo from "../CourseInfo";
import TrackScreen from "../CourseTracker";

const TabNavigator = createBottomTabNavigator({
	Courses: CourseScreen,
	Browse: CourseInfo,
	Track: TrackScreen,
});

export default createAppContainer(TabNavigator);
