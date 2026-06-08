import { Component, inject, signal } from '@angular/core';
import { Service } from '../../components/service/service';
import { Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-service-list',
	imports: [Service],
	templateUrl: './service-list.html',
	styleUrl: './service-list.css',
})
export class ServiceList {
	router = inject(Router);
	serviceService = inject(ServiceService);
	serviceList = toSignal(this.serviceService.getMaterials());


	handleServiceId(event: number) {
		this.router.navigate(['/booking-select', event]);
	}
}
