import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BookingSelect } from './booking-select';

describe('BookingSelect', () => {
	let component: BookingSelect;
	let fixture: ComponentFixture<BookingSelect>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BookingSelect],
			providers: [provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(BookingSelect);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
