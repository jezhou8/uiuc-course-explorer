const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const parser = require("fast-xml-parser");
admin.initializeApp(functions.config().firebase);

const YEAR = 2020;
const SEASON = "summer";

exports.updateCourseStatus = functions.https.onRequest(async (req, res) => {
	let CIS_API_URL = "";
	if (req.method === "POST") {
		try {
			const snapshot = await admin
				.firestore()
				.collection("tracked")
				.get();

			snapshot.docs.forEach((doc) => {
				let {
					Subject,
					SectionNumber,
					SectionId,
					EnrollmentStatus,
					Trackers,
				} = doc.data();
				let Number2 = doc.data().Number;
				let NotificationTitle =
					Subject + " " + Number2 + "-" + SectionId;

				if (Trackers <= 0) {
					doc.ref.delete();
					console.log("Deleted: ", NotificationTitle);
				} else {
					CIS_API_URL = `http://courses.illinois.edu/cisapp/explorer/schedule/${YEAR}/${SEASON}/${Subject}/${Number2}/${SectionNumber}.xml?mode=summary`;
					axios
						.get(CIS_API_URL)
						.then((res) => {
							let status = parseJsonFromXml(res.data);
							if (typeof status === "undefined") {
								console.log(
									"failed to find status for: ",
									NotificationTitle
								);
							} else if (
								status != EnrollmentStatus &&
								status != "UNKNOWN"
							) {
								doc.ref
									.update({ EnrollmentStatus: status })
									.then((res) =>
										console.log(
											"updated: ",
											Subject,
											Number2,
											SectionId
										)
									);
							}
						})
						.catch((err) => {
							console.error(
								"did not find section for: " + NotificationTitle
							);
							// TODO: also delete from users-list
						});
				}
			});
		} catch (err) {
			console.error(err);
		}

		res.send("Hello from Firebase!");
	}
});

function parseJsonFromXml(courseXml) {
	let courseJson = parser.parse(courseXml)["ns2:section"];
	return courseJson["enrollmentStatus"];
}
