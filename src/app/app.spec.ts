import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { KeycloakService } from './auth/keycloak.service';

describe('App', () => {
	let mockKeycloakService: Partial<KeycloakService>;

	beforeEach(async () => {
		mockKeycloakService = {
			isLoggedIn: false,
			username: 'test-user',
			login: async () => {},
			logout: async () => {},
		};

		await TestBed.configureTestingModule({
			imports: [App],
			providers: [provideRouter([]), { provide: KeycloakService, useValue: mockKeycloakService }],
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(App);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});
});
