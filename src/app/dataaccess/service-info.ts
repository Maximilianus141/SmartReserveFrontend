export interface ServiceInfo {
	id: number;
	name: string;
	description: string;
	durationSeconds: number; // Duration in seconds
	afterServiceBreakDurationSeconds: number; // Break duration after the service in seconds
	wholeDurationSeconds?: number; // Total duration including break in seconds
}
