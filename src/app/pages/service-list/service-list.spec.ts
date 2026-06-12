import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ServiceList } from './service-list';
import { ServiceService } from '../../services/service.service';
import { KeycloakService } from '../../auth/keycloak.service';
import { ServiceInfo } from '../../dataaccess/service-info';
import { vi } from 'vitest';

describe('ServiceList', () => {
	let component: ServiceList;
	let fixture: ComponentFixture<ServiceList>;
	let router: Router;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let mockServiceService: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let mockKeycloakService: any;

	const dummyServices: ServiceInfo[] = [
		{
			id: 1,
			name: 'Service 1',
			description: 'Desc 1',
			durationSeconds: 60,
			afterServiceBreakDurationSeconds: 10,
			wholeDurationSeconds: 70,
		},
		{
			id: 2,
			name: 'Service 2',
			description: 'Desc 2',
			durationSeconds: 120,
			afterServiceBreakDurationSeconds: 20,
			wholeDurationSeconds: 140,
		},
	];

	beforeEach(async () => {
		mockServiceService = {
			getMaterials: vi.fn().mockReturnValue(of(dummyServices)),
			deleteService: vi.fn().mockReturnValue(of({ message: 'Deleted' })),
		};

		mockKeycloakService = {
			hasRole: vi.fn().mockReturnValue(false),
		};

		await TestBed.configureTestingModule({
			imports: [ServiceList],
			providers: [
				provideRouter([]),
				{ provide: ServiceService, useValue: mockServiceService },
				{ provide: KeycloakService, useValue: mockKeycloakService },
			],
		}).compileComponents();

		router = TestBed.inject(Router);
		vi.spyOn(router, 'navigate');

		fixture = TestBed.createComponent(ServiceList);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should load services on init and populate the signal list', () => {
		fixture.detectChanges(); // triggers ngOnInit

		expect(mockServiceService.getMaterials).toHaveBeenCalled();
		expect(component.services()).toEqual(dummyServices);
	});

	it('should navigate to edit page on handleServiceEdit', () => {
		component.handleServiceEdit(123);
		expect(router.navigate).toHaveBeenCalledWith(['/service', 123, 'edit']);
	});

	it('should navigate to booking selection page on handleServiceId', () => {
		component.handleServiceId(456);
		expect(router.navigate).toHaveBeenCalledWith(['/booking-select', 456]);
	});

	describe('handleServiceDelete', () => {
		beforeEach(() => {
			vi.spyOn(window, 'alert').mockImplementation(() => {
				// noop
			});
			vi.spyOn(window, 'confirm');
		});

		it('should block non-admins and display warning alert', () => {
			mockKeycloakService.hasRole.mockReturnValue(false); // not admin

			component.handleServiceDelete(1);

			expect(mockKeycloakService.hasRole).toHaveBeenCalledWith('ROLE_admin');
			expect(window.alert).toHaveBeenCalledWith('Only administrators can delete services.');
			expect(mockServiceService.deleteService).not.toHaveBeenCalled();
		});

		it('should do nothing if admin cancels delete confirmation', () => {
			mockKeycloakService.hasRole.mockReturnValue(true); // is admin
			vi.mocked(window.confirm).mockReturnValue(false); // cancel

			component.handleServiceDelete(1);

			expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this service?');
			expect(mockServiceService.deleteService).not.toHaveBeenCalled();
		});

		it('should call delete endpoint and remove item from services signal if admin confirms', () => {
			fixture.detectChanges(); // loads dummyServices into component signal list
			expect(component.services().length).toBe(2);

			mockKeycloakService.hasRole.mockReturnValue(true); // is admin
			vi.mocked(window.confirm).mockReturnValue(true); // confirm

			component.handleServiceDelete(1);

			expect(mockServiceService.deleteService).toHaveBeenCalledWith(1);
			expect(component.services().length).toBe(1);
			expect(component.services().find((s) => s.id === 1)).toBeUndefined();
			expect(window.alert).toHaveBeenCalledWith('Service deleted successfully.');
		});

		it('should alert error if backend deletion fails', () => {
			mockKeycloakService.hasRole.mockReturnValue(true); // is admin
			vi.mocked(window.confirm).mockReturnValue(true); // confirm
			mockServiceService.deleteService.mockReturnValue(throwError(() => new Error('DB Error')));

			component.handleServiceDelete(1);

			expect(window.alert).toHaveBeenCalledWith('Failed to delete service.\nError: DB Error');
		});
	});
});
