import React from "react";
import { Text, View } from "react-native";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import CourseScreen from "../CourseCatalog";
import CourseInfo from "../CourseInfo";

const TabNavigator = createBottomTabNavigator({
	Courses: CourseScreen,
	Browse: CourseInfo,
	Track: CourseInfo,
});

export default createAppContainer(TabNavigator);
