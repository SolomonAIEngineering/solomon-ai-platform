export function generateTimeBasedIdentifier(): string {
	const timeInSeconds = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
	const hrTime = Date.now().toExponential(); // High resolution time in nanoseconds

	return `${timeInSeconds}-${hrTime.toString()}`;
}
