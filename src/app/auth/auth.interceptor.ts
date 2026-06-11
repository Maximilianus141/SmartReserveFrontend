import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from './keycloak.service';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const keycloakService = inject(KeycloakService);

	// If not logged in, just pass the request through
	if (!keycloakService.isLoggedIn) {
		return next(req);
	}

	// Refresh token if it's about to expire (minValidity of 30 seconds), then clone and send
	return from(keycloakService.refreshToken(30)).pipe(
		switchMap(() => {
			const token = keycloakService.token;
			if (token) {
				const authReq = req.clone({
					setHeaders: {
						Authorization: `Bearer ${token}`,
					},
				});
				return next(authReq);
			}
			return next(req);
		}),
	);
};
