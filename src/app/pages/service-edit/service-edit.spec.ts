import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceEdit } from './service-edit';
import { ServiceService } from '../../services/service.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('ServiceEdit', () => {
	let component: ServiceEdit;
	let fixture: ComponentFixture<ServiceEdit>;
	let mockServiceService: Partial<ServiceService>;

	beforeEach(async () => {
		mockServiceService = {
			getServiceById: () =>
				of({
					id: 1,
					name: 'Test Service',
					description: 'Test Desc',
					durationSeconds: 1800,
					afterServiceBreakDurationSeconds: 300,
				}),
			putService: () =>
				of({
					id: 1,
					name: 'Updated Service',
					description: 'Updated Desc',
					durationSeconds: 1800,
					afterServiceBreakDurationSeconds: 300,
				}),
			postService: () =>
				of({
					id: 2,
					name: 'New Service',
					description: 'New Desc',
					durationSeconds: 1800,
					afterServiceBreakDurationSeconds: 300,
				}),
		};

		await TestBed.configureTestingModule({
			imports: [ServiceEdit],
			providers: [provideRouter([]), { provide: ServiceService, useValue: mockServiceService }],
		}).compileComponents();

		fixture = TestBed.createComponent(ServiceEdit);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
