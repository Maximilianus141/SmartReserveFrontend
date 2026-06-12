import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ServiceList } from './service-list';
import { ServiceService } from '../../services/service.service';
import { KeycloakService } from '../../auth/keycloak.service';

describe('ServiceList', () => {
	let component: ServiceList;
	let fixture: ComponentFixture<ServiceList>;
	let mockServiceService: Partial<ServiceService>;
	let mockKeycloakService: Partial<KeycloakService>;

	beforeEach(async () => {
		mockServiceService = {
			getMaterials: () => of([]),
			deleteService: () => of({ message: 'Deleted' }),
		};

		mockKeycloakService = {
			hasRole: () => false,
		};

		await TestBed.configureTestingModule({
			imports: [ServiceList],
			providers: [
				provideRouter([]),
				{ provide: ServiceService, useValue: mockServiceService },
				{ provide: KeycloakService, useValue: mockKeycloakService },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ServiceList);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
