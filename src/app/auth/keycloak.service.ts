import { Injectable, inject } from '@angular/core';
import Keycloak from 'keycloak-js';
import { Env } from '../config/env';

@Injectable({
	providedIn: 'root',
})
export class KeycloakService {
	private readonly env = inject(Env);
	private keycloakInstance: Keycloak | null = null;

	async init(): Promise<boolean> {
		this.keycloakInstance = new Keycloak({
			url: this.env.keycloakUrl,
			realm: this.env.keycloakRealm,
			clientId: this.env.keycloakClientId,
		});

		try {
			const authenticated = await this.keycloakInstance.init({
				onLoad: 'check-sso',
				checkLoginIframe: false,
			});
			return authenticated;
		} catch (error) {
			console.error('Keycloak initialization failed', error);
			return false;
		}
	}

	get keycloak(): Keycloak {
		if (!this.keycloakInstance) {
			throw new Error('KeycloakService is not initialized. Call init() first.');
		}
		return this.keycloakInstance;
	}

	login(options?: Keycloak.KeycloakLoginOptions): Promise<void> {
		return this.keycloak.login(options);
	}

	logout(options?: Keycloak.KeycloakLogoutOptions): Promise<void> {
		return this.keycloak.logout(options);
	}

	get isLoggedIn(): boolean {
		return this.keycloakInstance?.authenticated || false;
	}

	get token(): string | undefined {
		return this.keycloakInstance?.token;
	}

	get username(): string | undefined {
		return this.keycloakInstance?.tokenParsed?.['preferred_username'];
	}

	get roles(): string[] {
		if (!this.keycloakInstance) return [];
		const realmRoles = this.keycloakInstance.realmAccess?.roles || [];
		const clientRoles =
			this.keycloakInstance.resourceAccess?.[this.env.keycloakClientId]?.roles || [];
		return [...realmRoles, ...clientRoles];
	}

	hasRole(role: string): boolean {
		if (!this.keycloakInstance) return false;
		// Check client-specific roles first
		const clientRoles =
			this.keycloakInstance.resourceAccess?.[this.env.keycloakClientId]?.roles || [];
		if (clientRoles.includes(role)) {
			return true;
		}
		// Fallback to realm-level roles
		return this.keycloakInstance.hasRealmRole(role);
	}

	async refreshToken(minValidity = 30): Promise<boolean> {
		try {
			if (!this.keycloakInstance) return false;
			return await this.keycloakInstance.updateToken(minValidity);
		} catch (error) {
			console.error('Failed to refresh Keycloak token', error);
			return false;
		}
	}
}
