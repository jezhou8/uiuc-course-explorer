export function hashCode(s) {
	for (var i = 0, h = 0; i < s.length; i++)
		h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
	return h.toString();
}

export function getTitleBySectionObject(section) {
	if (!("Number" in section)) {
		return "";
	}
	return section.Subject + " " + section.Number + "-" + section.SectionId;
}
