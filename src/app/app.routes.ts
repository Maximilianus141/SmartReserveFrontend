import { Routes } from '@angular/router';
import { ServiceList } from './pages/service-list/service-list';
import { BookingSelect } from './pages/booking-select/booking-select';

export const routes: Routes = [
    {
        path: '',
        component: ServiceList,
    },
    {
        path: 'booking-select/:serviceId',
        component: BookingSelect,
    }
];
