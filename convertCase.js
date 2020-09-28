export default function convertCase(str, caseIn, toCase) {
	let pattern1 = /[A-Z]/g // camel, pascal 
	let pattern2 = /_[\w]/g // snake 
	let pattern3 = /-[\w]/g // kebab
    let pattern = null
    
	if (caseIn == "camel") {
		pattern = pattern1
	} else if (caseIn == "snake") {
		pattern = pattern2
	} else if (caseIn == "kebab") {
		pattern = pattern3
	}

	return str.replace(pattern, function (match, offset, string) {
		if (caseIn == "camel" && toCase == "snake") {
			return '_' + match.toLowerCase();
		} else if (caseIn == "kebab" && toCase == "camel") {
			return match.substr(-1).toUpperCase();
		} else if (caseIn == "camel" && toCase == "kebab") {
			return '-' + match.toLowerCase();
		} else if (caseIn == "kebab" && toCase == "snake") {
			return "_" + match.substr(-1)
		}
	})
}