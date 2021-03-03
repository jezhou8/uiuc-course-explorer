const functions = require("firebase-functions");

const notifySubscribers = require("./notifySubscribers");
const updateCourseStatus = require("./updateCourseStatus");
exports.notifySubscribers = notifySubscribers.notifySubscribers;
exports.updateCourseStatus = updateCourseStatus.updateCourseStatus;
