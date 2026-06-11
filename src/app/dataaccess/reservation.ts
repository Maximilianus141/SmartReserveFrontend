import { User } from './user';
import { ServiceInfo } from './service-info';

export interface Reservation {
	id?: number;
	user?: User;
	service: ServiceInfo;
	status: string;
	startTime: string; // ISO date-time string
	endTime: string; // ISO date-time string, read-only
}

export interface AdminReservationRequestDTO {
	userId: string;
	serviceId: number;
	status?: string;
	startTime: string; // ISO date-time string
}

export interface GuestReservationRequestDTO {
	serviceId: number;
	startTime: string; // ISO date-time string
}

export interface MyReservationResponseDTO {
	id: number;
	service: ServiceInfo;
	status: string;
	startTime: string; // ISO date-time string
	endTime: string; // ISO date-time string
}

export interface ReservationResponseDTO {
	id: number;
	durationSeconds: number;
	startTime: string; // ISO date-time string
	endTime: string; // ISO date-time string
}

export interface MessageResponse {
	message: string;
}
