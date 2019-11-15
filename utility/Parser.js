import { parse } from "fast-xml-parser";

export function parseJsonFromXml(courseXml) {
	let courseJson = parse(courseXml)["ns2:course"];

	let course = {
		Description: courseJson["description"],
		CreditHours: courseJson["creditHours"],
		GenEds: [],
		Sections: [],
	};

	let genEds = courseJson["genEdCategories"];

	console.log(genEds);

	let sections = courseJson["detailedSections"];

	console.log(sections);

	return courseJson;
}
