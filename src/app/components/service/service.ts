import { Component, input, output, signal } from '@angular/core';
import { ServiceInfo } from '../../dataaccess/service-info';

@Component({
	selector: 'app-service',
	imports: [],
	templateUrl: './service.html',
	styleUrl: './service.css',
})
export class Service {
	service = input<ServiceInfo>({
		name: 'Service Name',
		description: 'Service Description',
		duration: 0,
		id: -1,
	});

	serviceId = output<number>();

	handleClick() {
		this.serviceId.emit(this.service().id);
	}
}
