import { parse } from "fast-xml-parser";

export function parseJsonFromXml(courseXml) {
	let courseJson = parse(courseXml)["ns2:course"];

	let course = {
		Description: courseJson["description"],
		CreditHours: courseJson["creditHours"],
		GenEds: ["None"],
		Sections: [],
	};

	if ("genEdCategories" in courseJson) {
		let genEds = courseJson["genEdCategories"]["category"];
		console.log(genEds);
		course["GenEds"].pop();
		if (!Array.isArray(genEds)) {
			course["GenEds"].push(
				genEds["ns2:genEdAttributes"]["genEdAttribute"]
			);
		} else {
			genEds.forEach(genEd => {
				if (
					genEd["ns2:genEdAttributes"]["genEdAttribute"].includes(
						"Beh Sci"
					)
				) {
					course["GenEds"].push("Behavioral & Social Science");
				} else if (
					genEd["ns2:genEdAttributes"]["genEdAttribute"].includes(
						"Minority"
					)
				) {
					course["GenEds"].push("US Minority");
				} else if (
					genEd["ns2:genEdAttributes"]["genEdAttribute"].includes(
						"Humanities"
					)
				) {
					course["GenEds"].push("Humanities & the Arts");
				}
			});
		}
	}
	let sections = courseJson["detailedSections"]["detailedSection"];

	sections.forEach(section => {
		course["Sections"].push({
			SectionNumber: section["sectionNumber"],
			EnrollmentStatus: section["enrollmentStatus"],
		});
	});

	console.log(course);
	return course;
}
