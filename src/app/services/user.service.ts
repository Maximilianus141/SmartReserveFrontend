import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Env } from '../config/env';
import { Observable } from 'rxjs';
import { User } from '../dataaccess/user';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private env = inject(Env);
	private http = inject(HttpClient);

	getMe(): Observable<User> {
		return this.http.get<User>(`${this.env.apiUrl}/user/me`);
	}
}
