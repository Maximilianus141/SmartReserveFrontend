import {
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { KeycloakService } from './auth/keycloak.service';
import { authInterceptor } from './auth/auth.interceptor';

export function initializeKeycloak(keycloakService: KeycloakService) {
	return () => keycloakService.init();
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes),
		provideHttpClient(withInterceptors([authInterceptor])),
		{
			provide: APP_INITIALIZER,
			useFactory: initializeKeycloak,
			deps: [KeycloakService],
			multi: true,
		},
	],
};
