import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSelectCalender } from './booking-select-calender';

describe('BookingSelectCalender', () => {
	let component: BookingSelectCalender;
	let fixture: ComponentFixture<BookingSelectCalender>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BookingSelectCalender],
		}).compileComponents();

		fixture = TestBed.createComponent(BookingSelectCalender);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
