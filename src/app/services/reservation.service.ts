import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Env } from '../config/env';
import { Observable } from 'rxjs';
import {
	Reservation,
	AdminReservationRequestDTO,
	GuestReservationRequestDTO,
	MyReservationResponseDTO,
	ReservationResponseDTO,
	MessageResponse,
} from '../dataaccess/reservation';

@Injectable({
	providedIn: 'root',
})
export class ReservationService {
	private env = inject(Env);
	private http = inject(HttpClient);

	// ==========================================
	// GUEST / ME RESERVATION ENDPOINTS
	// ==========================================

	getMyReservations(): Observable<MyReservationResponseDTO[]> {
		return this.http.get<MyReservationResponseDTO[]>(`${this.env.apiUrl}/me/reservations`);
	}

	postMyReservation(request: GuestReservationRequestDTO): Observable<MyReservationResponseDTO> {
		return this.http.post<MyReservationResponseDTO>(`${this.env.apiUrl}/me/reservation`, request);
	}

	cancelMyReservation(id: number): Observable<MessageResponse> {
		return this.http.patch<MessageResponse>(`${this.env.apiUrl}/me/reservation/${id}/cancel`, {});
	}

	getGuestReservations(): Observable<ReservationResponseDTO[]> {
		return this.http.get<ReservationResponseDTO[]>(`${this.env.apiUrl}/reservations`);
	}

	// ==========================================
	// ADMIN RESERVATION ENDPOINTS
	// ==========================================

	getAllReservations(): Observable<Reservation[]> {
		return this.http.get<Reservation[]>(`${this.env.apiUrl}/admin/reservations`);
	}

	getReservationById(id: number): Observable<Reservation> {
		return this.http.get<Reservation>(`${this.env.apiUrl}/admin/reservation/${id}`);
	}

	postReservation(request: AdminReservationRequestDTO): Observable<Reservation> {
		return this.http.post<Reservation>(`${this.env.apiUrl}/admin/reservation`, request);
	}

	putReservation(id: number, request: AdminReservationRequestDTO): Observable<Reservation> {
		return this.http.put<Reservation>(`${this.env.apiUrl}/admin/reservation/${id}`, request);
	}

	deleteReservation(id: number): Observable<MessageResponse> {
		return this.http.delete<MessageResponse>(`${this.env.apiUrl}/admin/reservation/${id}`);
	}
}
