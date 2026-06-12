import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class Env {
	readonly production = true;

	readonly apiUrl = 'http://localhost:9090/api';

	readonly keycloakUrl = 'http://localhost:8080';
	readonly keycloakRealm = 'smartreserve';
	readonly keycloakClientId = 'smartreserve';

	// Client roles defined in smartreserve-realm.json
	readonly roles = {
		guest: 'ROLE_guest',
		admin: 'ROLE_admin',
	} as const;
}

export type AppRole = (typeof Env.prototype.roles)[keyof typeof Env.prototype.roles];
