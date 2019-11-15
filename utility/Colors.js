export function getColorByGPA(gpa) {
	if (gpa >= 3.5) {
		return "#00C764";
	} else if (gpa >= 3.0) {
		return "#CFD101";
	} else if (gpa >= 2.5) {
		return "#FFC759";
	} else if (gpa >= 2.0) {
		return "#FFA02B";
	} else if (gpa >= 1.0) {
		return "#FF2B06";
	}
}

export function getColorByEnrollmentStatus(status) {
	if (status == "Open") {
		return "#0f0";
	} else {
		return "#f00";
	}
}
