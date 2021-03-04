/* eslint-disable require-jsdoc */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const parser = require("fast-xml-parser");
admin.initializeApp(functions.config().firebase);

const YEAR = 2021;
const SEASON = "spring";

exports.updateCourseStatus = functions.https.onRequest(async (req, res) => {
  let CIS_API_URL = "";
  if (req.method === "POST") {
    try {
      const snapshot = await admin
          .firestore()
          .collection("tracked")
          .get();

      snapshot.docs.forEach((doc) => {
        const {
          Subject,
          SectionNumber,
          SectionId,
          EnrollmentStatus,
          Trackers,
        } = doc.data();
        const Number2 = doc.data().Number;
        const NotificationTitle = Subject + " " + Number2 + "-" + SectionId;

        if (Trackers <= 0) {
          doc.ref.delete();
          console.log("Deleted: ", NotificationTitle);
        } else {
          CIS_API_URL = `http://courses.illinois.edu/cisapp/explorer/schedule/${YEAR}/${SEASON}/${Subject}/${Number2}/${SectionNumber}.xml?mode=summary`;
          axios
              .get(CIS_API_URL)
              .then((res) => {
                const status = parseJsonFromXml(res.data);
                if (typeof status === "undefined") {
                  console.log(
                      "failed to find status for: ",
                      NotificationTitle,
                  );
                } else if (
                  status != EnrollmentStatus && status != "UNKNOWN"
                ) {
                  doc.ref
                      .update({EnrollmentStatus: status})
                      .then((res) =>
                        console.log(
                            "updated: ",
                            Subject,
                            Number2,
                            SectionId,
                        ),
                      );
                }
              })
              .catch((err) => {
                console.error(
                    "did not find section for: " + NotificationTitle,
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
  const courseJson = parser.parse(courseXml)["ns2:section"];
  return courseJson["enrollmentStatus"];
}

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
        const sectionToFind = {
          Subject: newSection.Subject,
          Number: newSection.Number,
          SectionNumber: newSection.SectionNumber,
          SectionId: newSection.SectionId,
          EnrollmentStatus: oldSection.EnrollmentStatus,
        };

        const querySnapshot = await admin
            .firestore()
            .collection("users")
            .where("TrackedSections", "array-contains", sectionToFind)
            .get();

        const NotificationTitle =
                newSection.Subject +
                " " +
                newSection.Number +
                "-" +
                newSection.SectionId;

        const NotificationBody = "New status: " + newSection.EnrollmentStatus;

        const recipients = [];
        const notifications = {
          to: [],
          title: NotificationTitle,
          body: NotificationBody,
        };

        querySnapshot.forEach((doc) => {
          const tracking = doc.data().TrackedSections;

          const index = tracking.findIndex(
              (section) =>
                section.Subject == sectionToFind.Subject &&
                        section.Number == sectionToFind.Number &&
                        section.SectionNumber == sectionToFind.SectionNumber,
          );

          // TODO: fix this, very expensive.
          tracking[index].EnrollmentStatus = newSection.EnrollmentStatus;
          doc.ref.set(
              {
                TrackedSections: tracking,
              },
              {merge: true},
          );
          recipients.push(doc.id);
        });

        // sends 100 at a time (maximum number expo servers can handle)
        while (recipients.length > 0) {
          notifications.to = recipients.splice(0, 100);
          console.log(notifications);
          await axios({
            method: "post",
            url: EXPO_URL,
            data: notifications,
            headers: {
              "host": "exp.host",
              "accept": "application/json",
              "accept-encoding": "gzip, deflate",
              "content-type": "application/json",
            },
          });
        }

        return {status: "200"};
      }
    });
