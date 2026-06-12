import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { KeycloakService } from '../../auth/keycloak.service';

@Component({
	selector: 'app-header',
	imports: [RouterLink, RouterLinkActive],
	templateUrl: './header.html',
	styleUrl: './header.scss',
})
export class Header {
	protected readonly keycloakService = inject(KeycloakService);

	login(): void {
		this.keycloakService.login();
	}

	logout(): void {
		this.keycloakService.logout({ redirectUri: window.location.origin });
	}
}
