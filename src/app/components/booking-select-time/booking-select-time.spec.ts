import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSelectTime } from './booking-select-time';

describe('BookingSelectTime', () => {
	let component: BookingSelectTime;
	let fixture: ComponentFixture<BookingSelectTime>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BookingSelectTime],
		}).compileComponents();

		fixture = TestBed.createComponent(BookingSelectTime);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
