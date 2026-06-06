import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from './keycloak.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (keycloakService.isLoggedIn) {
    return true;
  }

  // Redirect to Keycloak login, saving the current URL as redirect URI
  await keycloakService.login({
    redirectUri: window.location.origin + state.url,
  });
  return false;
};
