import { Component, inject, signal } from '@angular/core';
import { Service } from '../../components/service/service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-service-list',
	imports: [Service],
	templateUrl: './service-list.html',
	styleUrl: './service-list.css',
})
export class ServiceList {
	router = inject(Router);
	serviceList = signal([
		{
			id: 1,
			name: 'Demo Service',
			description:
				'This is a demo service for testing purposes. this is to see if the shit is just buggy or i did something wrong, seems like i did something wrong',
			duration: 3600, // Duration in seconds (1 hour)
		},
		{
			id: 2,
			name: 'Demo Service',
			description:
				'This is a demo service for testing purposes. i did something wrong, seems like i did something wrong',
			duration: 3600, // Duration in seconds (1 hour)
		},
		{
			id: 3,
			name: 'Demo Service',
			description:
				'this is to see if the shit is just buggy or i did something wrong, seems like i did something wrong',
			duration: 3600, // Duration in seconds (1 hour)
		},
		{
			id: 4,
			name: 'Demo Service',
			description:
				'This is a demo service for testing purposes. this is to see if the shit is just buggy or i did something wrong, seems like i did something wrong',
			duration: 3600, // Duration in seconds (1 hour)
		},
	]);


	handleServiceId(event: number) {
		console.log("WHAAA ", event)
		this.router.navigate(['/booking-select', event]);
	}
}
