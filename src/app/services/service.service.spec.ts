import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceService } from './service.service';

describe('ServiceService', () => {
	let service: ServiceService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting()],
		});
		service = TestBed.inject(ServiceService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
