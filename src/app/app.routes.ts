import { Routes } from '@angular/router';
import { ServiceList } from './pages/service-list/service-list';
import { BookingSelect } from './pages/booking-select/booking-select';
import { ServiceEdit } from './pages/service-edit/service-edit';
import { authGuard } from './auth/auth.guard';
import { ReservationManagement } from './pages/reservation-management/reservation-management';

export const routes: Routes = [
	{
		path: '',
		component: ServiceList,
	},
	{
		path: 'booking-select/:serviceId',
		component: BookingSelect,
	},
	{
		path: 'service/:serviceId/edit',
		component: ServiceEdit,
		canActivate: [authGuard],
		data: { roles: ['ROLE_admin'] },
	},
	{
		path: 'reservations',
		component: ReservationManagement,
		canActivate: [authGuard],
		data: { roles: ['ROLE_guest'] },
	},
];
