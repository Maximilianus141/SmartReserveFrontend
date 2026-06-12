import { Component, inject, OnInit, signal } from '@angular/core';
import { Service } from '../../components/service/service';
import { Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { KeycloakService } from '../../auth/keycloak.service';
import { ServiceInfo } from '../../dataaccess/service-info';

@Component({
	selector: 'app-service-list',
	imports: [Service],
	templateUrl: './service-list.html',
	styleUrl: './service-list.scss',
})
export class ServiceList implements OnInit {
	router = inject(Router);
	serviceService = inject(ServiceService);
	keycloakService = inject(KeycloakService);

	services = signal<ServiceInfo[]>([]);

	ngOnInit(): void {
		this.loadServices();
	}

	loadServices(): void {
		this.serviceService.getMaterials().subscribe({
			next: (list) => {
				this.services.set(list);
			},
			error: (err) => console.error('Failed to load services', err),
		});
	}

	handleServiceEdit($event: number) {
		this.router.navigate(['/service', $event, 'edit']);
	}

	handleServiceId(event: number) {
		this.router.navigate(['/booking-select', event]);
	}

	handleServiceDelete(id: number) {
		if (!this.keycloakService.hasRole('ROLE_admin')) {
			alert('Only administrators can delete services, nyaa~!');
			return;
		}

		if (!confirm('Are you sure you want to delete this service, nyaa~? :3')) {
			return;
		}

		this.serviceService.deleteService(id).subscribe({
			next: () => {
				// Remove the deleted service from the local list signal dynamically!
				this.services.update((list) => list.filter((s) => s.id !== id));
				alert('Service deleted successfully, nyaa~! :3');
			},
			error: (err) => {
				console.error('Failed to delete service', err);
				alert(`Oh no! Failed to delete service, nyaa~!\nError: ${err.message || err.statusText || 'Unknown error'}`);
			},
		});
	}
}
