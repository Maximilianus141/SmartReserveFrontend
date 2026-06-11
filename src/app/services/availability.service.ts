import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Env } from '../config/env';
import { availabilityInfo } from '../dataaccess/availability';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AvailabilityService {
	private env = inject(Env);
	private http = inject(HttpClient);

	getAvailability(date: string): Observable<availabilityInfo[]> {
		return this.http.get<availabilityInfo[]>(`${this.env.apiUrl}/availability/${date}`);
	}
}
