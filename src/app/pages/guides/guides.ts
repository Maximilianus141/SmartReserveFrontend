import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { marked } from 'marked';

export interface Guide {
	id: string;
	title: string;
	description: string;
	category: string;
	date: string;
	content: string;
}

@Component({
	selector: 'app-guides',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './guides.html',
	styleUrl: './guides.scss',
})
export class Guides implements OnInit {
	guides = signal<Guide[]>([]);
	selectedGuideId = signal<string | null>(null);
	activeCategory = signal<string>('all');

	categories = computed(() => {
		const cats = this.guides().map((g) => g.category);
		return ['all', ...new Set(cats)];
	});

	filteredGuides = computed(() => {
		const cat = this.activeCategory();
		const list = this.guides();
		if (cat === 'all') return list;
		return list.filter((g) => g.category === cat);
	});

	selectedGuide = computed(() => {
		const id = this.selectedGuideId();
		if (!id) return null;
		return this.guides().find((g) => g.id === id) || null;
	});

	renderedContent = computed(() => {
		const guide = this.selectedGuide();
		if (!guide) return '';
		// Safe HTML parse via marked
		return marked.parse(guide.content) as string;
	});

	ngOnInit() {
		this.guides.set([
			{
				id: 'nix-flatpak',
				title: 'Nix-Flatpak Setup Guide',
				description: 'Learn how to set up and manage Flatpaks declaratively in NixOS using flakes.',
				category: 'NixOS',
				date: '2026-06-11',
				content: `# Declarative Flatpaks on NixOS with Nix-Flatpak\n\nFlatpak is a fantastic way to run proprietary or desktop apps that are hard to package on NixOS. With \`nix-flatpak\`, you can declare your Flatpaks right in your configuration!\n\n## 1. Update \`flake.nix\` Inputs\n\nAdd the \`nix-flatpak\` input to your system flake:\n\n\`\`\`nix\n{\n  inputs = {\n    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";\n    nix-flatpak.url = "github:gmodena/nix-flatpak/?ref=latest";\n  };\n\n  outputs = { nixpkgs, nix-flatpak, ... }@inputs: {\n    nixosConfigurations.clawy = nixpkgs.lib.nixosSystem {\n      specialArgs = { inherit inputs; };\n      modules = [\n        nix-flatpak.nixosModules.nix-flatpak\n        ./configuration.nix\n      ];\n    };\n  };\n}\n\`\`\`\n\n## 2. Configure Flatpaks\n\nAdd this to your \`configuration.nix\` or a dedicated \`flatpak.nix\`:\n\n\`\`\`nix\n{\n  services.flatpak = {\n    enable = true;\n    update.onActivation = true;\n    \n    # Optional: uninstall flatpaks not declared here\n    # uninstallUnmanaged = true;\n\n    packages = [\n      "com.brave.Browser"\n      "org.mozilla.firefox"\n      { appId = "com.obsproject.Studio"; origin = "flathub"; }\n    ];\n  };\n}\n\`\`\`\n\n## 3. Rebuild and Switch\n\nApply your new NixOS configuration:\n\n\`\`\`bash\nsudo nixos-rebuild switch --flake .#clawy\n\`\`\``,
			},
			{
				id: 'angular-keycloak',
				title: 'Angular Standalone & Keycloak Integration',
				description:
					'Step-by-step setup for Keycloak authentication in modern standalone Angular applications.',
				category: 'Angular',
				date: '2026-06-11',
				content: `# Angular & Keycloak OAuth2 Integration Guide\n\nThis guide details how to implement secure OpenID Connect (OIDC) authentication using Keycloak and \`keycloak-js\` in a modern Angular standalone application.\n\n## 1. Install Dependencies\n\nInstall the official Keycloak client library:\n\n\`\`\`bash\nnpm install keycloak-js\n\`\`\`\n\n## 2. Environment Configuration\n\nCreate a dedicated \`env.ts\` file under \`src/app/config/\` to hold Keycloak parameters:\n\n\`\`\`typescript\nimport { Injectable } from '@angular/core';\n\n@Injectable({\n  providedIn: 'root',\n})\nexport class Env {\n  readonly production = false;\n  readonly keycloakUrl = 'http://localhost:8080';\n  readonly keycloakRealm = 'smartreserve';\n  readonly keycloakClientId = 'smartreserve';\n}\n\`\`\`\n\n## 3. Keycloak Authentication Service\n\nImplement a service to manage the lifecycle of Keycloak initialization, login, logout, and tokens:\n\n\`\`\`typescript\nimport { Injectable, inject } from '@angular/core';\nimport Keycloak from 'keycloak-js';\nimport { Env } from '../config/env';\n\n@Injectable({\n  providedIn: 'root',\n})\nexport class KeycloakService {\n  private readonly env = inject(Env);\n  private keycloakInstance: Keycloak | null = null;\n\n  async init(): Promise<boolean> {\n    this.keycloakInstance = new Keycloak({\n      url: this.env.keycloakUrl,\n      realm: this.env.keycloakRealm,\n      clientId: this.env.keycloakClientId,\n    });\n\n    try {\n      const authenticated = await this.keycloakInstance.init({\n        onLoad: 'check-sso',\n        checkLoginIframe: false,\n      });\n      return authenticated;\n    } catch (error) {\n      console.error('Keycloak initialization failed', error);\n      return false;\n    }\n  }\n\n  get isLoggedIn(): boolean {\n    return this.keycloakInstance?.authenticated || false;\n  }\n\n  get token(): string | undefined {\n    return this.keycloakInstance?.token;\n  }\n\n  hasRole(role: string): boolean {\n    return this.keycloakInstance?.hasResourceRole(role) || \n           this.keycloakInstance?.hasRealmRole(role) || false;\n  }\n}\n\`\`\`\n\n## 4. Register the Service\n\nRegister the initializer in \`app.config.ts\` so Keycloak boots up before the Angular app renders:\n\n\`\`\`typescript\nimport { ApplicationConfig, APP_INITIALIZER } from '@angular/core';\nimport { KeycloakService } from './auth/keycloak.service';\n\nexport function initializeKeycloak(keycloakService: KeycloakService) {\n  return () => keycloakService.init();\n}\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    {\n      provide: APP_INITIALIZER,\n      useFactory: initializeKeycloak,\n      deps: [KeycloakService],\n      multi: true,\n    },\n  ],\n};\n\`\`\``,
			},
		]);
	}

	selectGuide(id: string) {
		this.selectedGuideId.set(id);
	}

	setCategory(cat: string) {
		this.activeCategory.set(cat);
	}
}
