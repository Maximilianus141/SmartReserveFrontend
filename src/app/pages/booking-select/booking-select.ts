import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ServiceInfo } from '../../dataaccess/service-info';

@Component({
    selector: 'app-booking-select',
    imports: [],
    templateUrl: './booking-select.html',
    styleUrl: './booking-select.css',
})
export class BookingSelect {
    serviceId: Signal<number>;
	service: ServiceInfo | null = null;

    constructor(private route: ActivatedRoute) {
        this.serviceId = toSignal(
            this.route.paramMap.pipe(
                map(params => {
                    const id = params.get('serviceId');
                    return id ? parseInt(id) : -1;
                })
            ),
            { initialValue: -1 } 
        );
    }
}