class Course {
	constructor() {
		this.subject = "";
		this.number = "";
		this.genEds = [];
	}

	set subject(subject) {
		this.subject = subject;
	}

	get subject() {
		return this.subject;
	}
}
