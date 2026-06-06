import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderDate } from './calender-date';

describe('CalenderDate', () => {
	let component: CalenderDate;
	let fixture: ComponentFixture<CalenderDate>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CalenderDate],
		}).compileComponents();

		fixture = TestBed.createComponent(CalenderDate);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
