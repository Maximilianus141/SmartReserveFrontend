import { inject, Injectable } from '@angular/core';
import { Env } from '../config/env';
import { Observable } from 'rxjs';
import { ServiceInfo } from '../dataaccess/service-info';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class ServiceService {
	private env = inject(Env);
	private http = inject(HttpClient);

	getMaterials(): Observable<ServiceInfo[]> {
		return this.http.get<ServiceInfo[]>(`${this.env.apiUrl}/service`);
	}
}
