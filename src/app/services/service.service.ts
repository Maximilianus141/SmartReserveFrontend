import { inject, Injectable } from '@angular/core';
import { Env } from '../config/env';
import { Observable } from 'rxjs';
import { ServiceInfo } from '../dataaccess/service-info';
import { MessageResponse } from '../dataaccess/reservation';
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

	getServiceById(id: number): Observable<ServiceInfo> {
		return this.http.get<ServiceInfo>(`${this.env.apiUrl}/service/${id}`);
	}

	postService(service: Omit<ServiceInfo, 'id'>): Observable<ServiceInfo> {
		return this.http.post<ServiceInfo>(`${this.env.apiUrl}/service`, service);
	}

	putService(id: number, service: ServiceInfo): Observable<ServiceInfo> {
		return this.http.put<ServiceInfo>(`${this.env.apiUrl}/service/${id}`, service);
	}

	deleteService(id: number): Observable<MessageResponse> {
		return this.http.delete<MessageResponse>(`${this.env.apiUrl}/service/${id}`);
	}
}
