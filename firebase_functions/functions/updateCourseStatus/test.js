const axios = require("axios");
var parser = require("fast-xml-parser");

function parseJsonFromXml(courseXml) {
	let courseJson = parser.parse(courseXml)["ns2:section"];

	return courseJson["enrollmentStatus"];
}

function run() {
	let CIS_API_URL = `http://courses.illinois.edu/cisapp/explorer/schedule/2020/spring/AAS/100/30107.xml?mode=summary`;
	axios
		.get(CIS_API_URL)
		.then(res => {
			const sectionStatus = parseJsonFromXml(res.data);
			console.log(sectionStatus);
		})
		.catch(err => {
			console.log(err.message);
		});
}

run();
