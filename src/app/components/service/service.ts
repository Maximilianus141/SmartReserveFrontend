import { Component, HostListener, inject, input, output, signal } from '@angular/core';
import { ServiceInfo } from '../../dataaccess/service-info';
import { KeycloakService } from '../../auth/keycloak.service';

// Track the ID of the currently open service menu (null if all are closed)
export const activeMenuServiceId = signal<number | null>(null);

@Component({
	selector: 'app-service',
	imports: [],
	templateUrl: './service.html',
	styleUrl: './service.css',
})
export class Service {
	keycloakService = inject(KeycloakService);

	service = input<ServiceInfo>({
		name: 'Service Name',
		description: 'Service Description',
		durationSeconds: 0,
		id: -1,
	});

	activeMenuId = activeMenuServiceId;

	serviceId = output<number>();
	menuPosition = signal({ x: 0, y: 0 });

	handleClick() {
		this.serviceId.emit(this.service().id);
		console.log('Emitted service ID: ', this.service().id);
		activeMenuServiceId.set(null); // Close the menu
	}

	handleRightClick(event: MouseEvent) {
		if (!this.keycloakService.hasRole('ROLE_admin')) {
			return;
		}
		event.preventDefault(); // Stop default browser menu
		event.stopPropagation(); // Prevents document:click from firing instantly

		// Set the coordinates for THIS specific instance
		this.menuPosition.set({ x: event.clientX, y: event.clientY });

		// Tell the global state that THIS service's menu is the open one
		activeMenuServiceId.set(this.service().id);
	}

	@HostListener('document:click')
	closeMenu() {
		// If any menu is open, clicking anywhere else resets it to null
		if (activeMenuServiceId() !== null) {
			activeMenuServiceId.set(null);
		}
	}
}
