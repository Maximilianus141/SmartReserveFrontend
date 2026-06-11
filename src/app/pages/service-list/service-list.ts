import { Component, inject, signal } from '@angular/core';
import { Service } from '../../components/service/service';
import { Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { KeycloakService } from '../../auth/keycloak.service';

@Component({
	selector: 'app-service-list',
	imports: [Service],
	templateUrl: './service-list.html',
	styleUrl: './service-list.scss',
})
export class ServiceList {
	router = inject(Router);
	serviceService = inject(ServiceService);
	keycloakService = inject(KeycloakService);
	serviceList = toSignal(this.serviceService.getMaterials());

	handleServiceEdit($event: number) {
		this.router.navigate(['/service', $event, 'edit']);
	}

	handleServiceId(event: number) {
		this.router.navigate(['/booking-select', event]);
	}
}
