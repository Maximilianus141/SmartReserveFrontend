import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Header } from './header';
import { KeycloakService } from '../../auth/keycloak.service';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let mockKeycloakService: Partial<KeycloakService>;

  beforeEach(async () => {
    mockKeycloakService = {
      isLoggedIn: false,
      username: 'test-user',
      login: async () => {},
      logout: async () => {},
    };

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([]),
        { provide: KeycloakService, useValue: mockKeycloakService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
