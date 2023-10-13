/**
 * convert a seconds number into a "mm:ss" string
 * @param seconds
 */
export function secondsToHHmm(seconds: number) {
	let m: string | number = Math.floor(seconds / 60);
	let s: string | number = seconds - m * 60;
	if (s < 10) s = '0' + s;
	if (m < 10) m = '0' + m;
	return `${m}:${s}`;
}

/**
 * Generate picker options for seconds from 0 to 55, by 5
 */
export function getSecondsPickerOptions() {
	const options = [];
	for (let i = 0; i < 60; i += 5) {
		options.push({
			text: i < 10 ? `0${i}` : i.toString(),
			value: i
		});
	}
	return options;
}

/**
 * Generate round options between 1 and 20
 */
export function getRoundsPickerOptions() {
	const options = [];
	for (let i = 1; i <= 20; i++) {
		options.push({
			text: i.toString(),
			value: i
		});
	}
	return options;
}

/**
 * Generate picker options for minutes, from 0 to 30
 */
export function getMinutesPickerOptions() {
	const options = [];
	for (let i = 0; i <= 30; i++) {
		options.push({
			text: i < 10 ? `0${i}` : i.toString(),
			value: i
		});
	}
	return options;
}
