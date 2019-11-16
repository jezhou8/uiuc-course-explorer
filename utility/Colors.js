export function getColorByGPA(gpa) {
	if (gpa >= 3.5) {
		return { backgroundColor: "#00C764", textColor: "#0E8E0E" };
	} else if (gpa >= 3.0) {
		return { backgroundColor: "#CFD101", textColor: "#919200" };
	} else if (gpa >= 2.5) {
		return { backgroundColor: "#FFC759", textColor: "#F2A000" };
	} else if (gpa >= 2.0) {
		return { backgroundColor: "#FFA02B", textColor: "#FFF" };
	} else if (gpa >= 1.0) {
		return { backgroundColor: "#FF2B06", textColor: "#FFF" };
	}
}

export function getColorByEnrollmentStatus(status) {
	if (status == "Open") {
		return "#0f0";
	} else if (status.includes("Open") && status.includes("Restricted")) {
		return "#FFA500";
	} else {
		return "#f00";
	}
}
