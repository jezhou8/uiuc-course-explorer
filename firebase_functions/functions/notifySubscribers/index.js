const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
admin.initializeApp(functions.config().firebase);

const EXPO_URL = "https://exp.host/--/api/v2/push/send";

exports.notifySubscribers = functions.firestore
	.document("tracked/{section}")
	.onUpdate(async (change, context) => {
		// Get an object representing the document
		const newSection = change.after.data();
		const oldSection = change.before.data();
		console.log(newSection);
		if (newSection.EnrollmentStatus != oldSection.EnrollmentStatus) {
			// find all users that match and alert them
			let sectionToFind = {
				Subject: newSection.Subject,
				Number: newSection.Number,
				SectionNumber: newSection.SectionNumber,
				SectionId: newSection.SectionId,
				EnrollmentStatus: oldSection.EnrollmentStatus,
			};

			let querySnapshot = await admin
				.firestore()
				.collection("users")
				.where("TrackedSections", "array-contains", sectionToFind)
				.get();

			let NotificationTitle =
				newSection.Subject +
				" " +
				newSection.Number +
				"-" +
				newSection.SectionId;

			let NotificationBody = "New status: " + newSection.EnrollmentStatus;

			let recipients = [];
			let notifications = {
				to: [],
				title: NotificationTitle,
				body: NotificationBody,
			};

			querySnapshot.forEach((doc) => {
				let tracking = doc.data().TrackedSections;

				let index = tracking.findIndex(
					(section) =>
						section.Subject == sectionToFind.Subject &&
						section.Number == sectionToFind.Number &&
						section.SectionNumber == sectionToFind.SectionNumber
				);

				// TODO: fix this, very expensive.
				tracking[index].EnrollmentStatus = newSection.EnrollmentStatus;
				doc.ref.set(
					{
						TrackedSections: tracking,
					},
					{ merge: true }
				);
				recipients.push(doc.id);
			});

			// sends 100 at a time since that is the maximum number expo servers can handle
			while (recipients.length > 0) {
				notifications.to = recipients.splice(0, 100);
				console.log(notifications);
				let sendNotifications = await axios({
					method: "post",
					url: EXPO_URL,
					data: notifications,
					headers: {
						host: "exp.host",
						accept: "application/json",
						"accept-encoding": "gzip, deflate",
						"content-type": "application/json",
					},
				});
			}

			return { status: "200" };
		}
	});
