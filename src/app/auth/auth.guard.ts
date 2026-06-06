import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from './keycloak.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (!keycloakService.isLoggedIn) {
    // Redirect to Keycloak login, saving the current URL as redirect URI
    await keycloakService.login({
      redirectUri: window.location.origin + state.url,
    });
    return false;
  }

  // Check roles if they are defined on the route data
  const requiredRoles = route.data?.['roles'] as string[] | undefined;
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => keycloakService.hasRole(role));
    if (!hasRequiredRole) {
      // User is authenticated but lacks the required role, redirect to unauthorized/home
      await router.navigate(['/']);
      return false;
    }
  }

  return true;
};
