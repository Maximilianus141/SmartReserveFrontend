import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Env } from '../config/env';

@Injectable({
	providedIn: 'root',
})
export class AvailabilityService {
	private env = inject(Env);
	private http = inject(HttpClient);

	getAvailability(serviceId: number, date: string) {
		return this.http.get(`${this.env.apiUrl}/availability/${date}`);
	}
}
