import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloakInstance: Keycloak | null = null;

  constructor() {}

  async init(): Promise<boolean> {
    this.keycloakInstance = new Keycloak({
      url: 'http://localhost:8080', // Default Keycloak URL (can be customized)
      realm: 'smart-reserve',       // Default realm name
      clientId: 'smart-reserve-frontend', // Default client ID
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
    return this.keycloakInstance?.realmAccess?.roles || [];
  }

  async refreshToken(minValidity: number = 30): Promise<boolean> {
    try {
      if (!this.keycloakInstance) return false;
      return await this.keycloakInstance.updateToken(minValidity);
    } catch (error) {
      console.error('Failed to refresh Keycloak token', error);
      return false;
    }
  }
}
