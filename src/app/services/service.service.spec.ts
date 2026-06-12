import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceService } from './service.service';
import { Env } from '../config/env';
import { ServiceInfo } from '../dataaccess/service-info';

describe('ServiceService', () => {
	let service: ServiceService;
	let httpMock: HttpTestingController;
	let env: Env;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting(), Env],
		});
		service = TestBed.inject(ServiceService);
		httpMock = TestBed.inject(HttpTestingController);
		env = TestBed.inject(Env);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should fetch all services (getMaterials)', () => {
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

		service.getMaterials().subscribe((services) => {
			expect(services.length).toBe(2);
			expect(services).toEqual(dummyServices);
		});

		const req = httpMock.expectOne(`${env.apiUrl}/service`);
		expect(req.request.method).toBe('GET');
		req.flush(dummyServices);
	});

	it('should fetch a service by ID (getServiceById)', () => {
		const dummyService: ServiceInfo = {
			id: 1,
			name: 'Service 1',
			description: 'Desc 1',
			durationSeconds: 60,
			afterServiceBreakDurationSeconds: 10,
			wholeDurationSeconds: 70,
		};

		service.getServiceById(1).subscribe((srv) => {
			expect(srv).toEqual(dummyService);
		});

		const req = httpMock.expectOne(`${env.apiUrl}/service/1`);
		expect(req.request.method).toBe('GET');
		req.flush(dummyService);
	});

	it('should create a new service (postService)', () => {
		const newService: Omit<ServiceInfo, 'id'> = {
			name: 'New Service',
			description: 'New Desc',
			durationSeconds: 60,
			afterServiceBreakDurationSeconds: 10,
			wholeDurationSeconds: 70,
		};
		const savedService: ServiceInfo = { id: 3, ...newService };

		service.postService(newService).subscribe((srv) => {
			expect(srv).toEqual(savedService);
		});

		const req = httpMock.expectOne(`${env.apiUrl}/service`);
		expect(req.request.method).toBe('POST');
		expect(req.request.body).toEqual(newService);
		req.flush(savedService);
	});

	it('should update a service (putService)', () => {
		const updatedService: ServiceInfo = {
			id: 1,
			name: 'Updated Service',
			description: 'Updated Desc',
			durationSeconds: 120,
			afterServiceBreakDurationSeconds: 20,
			wholeDurationSeconds: 140,
		};

		service.putService(1, updatedService).subscribe((srv) => {
			expect(srv).toEqual(updatedService);
		});

		const req = httpMock.expectOne(`${env.apiUrl}/service/1`);
		expect(req.request.method).toBe('PUT');
		expect(req.request.body).toEqual(updatedService);
		req.flush(updatedService);
	});

	it('should delete a service (deleteService)', () => {
		const dummyResponse = { message: 'Service 1 deleted' };

		service.deleteService(1).subscribe((res) => {
			expect(res).toEqual(dummyResponse);
		});

		const req = httpMock.expectOne(`${env.apiUrl}/service/1`);
		expect(req.request.method).toBe('DELETE');
		req.flush(dummyResponse);
	});
});
