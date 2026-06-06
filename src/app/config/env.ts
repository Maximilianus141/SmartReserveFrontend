import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Env {
  readonly production = false;
  readonly keycloakUrl = 'http://localhost:8080';
  readonly keycloakRealm = 'smartreserve';
  readonly keycloakClientId = 'smartreserve';
}
