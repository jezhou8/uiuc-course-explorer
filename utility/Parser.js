import { parse } from "fast-xml-parser";

export function parseJsonFromXml(courseXml) {
	let courseJson = parse(courseXml, {
		attributeNamePrefix: "",
		ignoreAttributes: false,
	})["ns2:course"];

	let course = {
		Description: courseJson["description"],
		CreditHours: courseJson["creditHours"],
		GenEds: ["No GenEds Fulfilled"],
		Sections: [],
	};

	if ("genEdCategories" in courseJson) {
		let genEds = courseJson["genEdCategories"]["category"];
		course["GenEds"].pop();
		if (!Array.isArray(genEds)) {
			let genEdAttribute =
				genEds["ns2:genEdAttributes"]["genEdAttribute"];
			if (genEdAttribute["code"] === "1SS") {
				course["GenEds"].push("Social & Behavorial Science");
			} else if (genEdAttribute["code"] == "1US") {
				course["GenEds"].push("US Minority");
			} else if (genEdAttribute["code"] == "1HP") {
				course["GenEds"].push("Humanities & the Arts");
			} else {
				course["GenEds"].push(genEdAttribute["#text"]);
			}
		} else {
			genEds.forEach(genEd => {
				let genEdAttribute =
					genEd["ns2:genEdAttributes"]["genEdAttribute"];
				if (genEdAttribute["code"] === "1SS") {
					course["GenEds"].push("Social & Behavorial Science");
				} else if (genEdAttribute["code"] == "1US") {
					course["GenEds"].push("US Minority");
				} else if (genEdAttribute["code"] == "1HP") {
					course["GenEds"].push("Humanities & the Arts");
				} else {
					course["GenEds"].push(genEdAttribute["#text"]);
				}
			});
		}
	}

	if ("detailedSections" in courseJson) {
		let sections = courseJson["detailedSections"]["detailedSection"];
		if (!Array.isArray(sections)) {
			course["Sections"].push({
				SectionId: section["sectionNumber"],
				SectionNumber: section["id"],
				EnrollmentStatus: section["enrollmentStatus"],
			});
		} else {
			sections.map(section => {
				course["Sections"].push({
					SectionId: section["sectionNumber"],
					SectionNumber: section["id"],
					EnrollmentStatus: section["enrollmentStatus"],
				});
			});
		}
	}

	return course;
}

export function parseStatusFromString(s) {
	let res = s.replace("(Restricted)", "");

	if (res == "") {
		res = "Unknown";
	}

	return res;
}
