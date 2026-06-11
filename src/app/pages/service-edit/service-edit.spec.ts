import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceEdit } from './service-edit';

describe('ServiceEdit', () => {
	let component: ServiceEdit;
	let fixture: ComponentFixture<ServiceEdit>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ServiceEdit],
		}).compileComponents();

		fixture = TestBed.createComponent(ServiceEdit);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
