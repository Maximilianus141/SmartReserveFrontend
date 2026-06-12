import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceInfo } from '../../dataaccess/service-info';
import { ServiceService } from '../../services/service.service';

@Component({
	selector: 'app-service-edit',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './service-edit.html',
	styleUrl: './service-edit.scss',
})
export class ServiceEdit implements OnInit {
	private fb = inject(FormBuilder);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private serviceService = inject(ServiceService);

	serviceForm!: FormGroup;
	isEditMode = false;

	ngOnInit(): void {
		this.initForm();

		this.route.paramMap.subscribe((params) => {
			const idParam = params.get('serviceId');
			if (idParam && idParam !== 'new') {
				this.isEditMode = true;
				const serviceId = Number(idParam);
				this.serviceService.getServiceById(serviceId).subscribe({
					next: (service) => {
						this.loadFormValues(service);
					},
					error: (err) => console.error('Failed to load service', err),
				});
			} else {
				this.isEditMode = false;
				this.serviceForm.reset({
					id: null,
					name: '',
					description: '',
					durationMinutes: null,
					afterServiceBreakDurationMinutes: null,
				});
			}
		});
	}

	private initForm(): void {
		this.serviceForm = this.fb.group({
			id: [null],
			name: ['', [Validators.required, Validators.minLength(3)]],
			description: ['', [Validators.required]],
			// We use minutes in the UI controls for better user experience
			durationMinutes: [null, [Validators.required, Validators.min(1)]],
			afterServiceBreakDurationMinutes: [null, [Validators.required, Validators.min(0)]],
		});
	}

	private loadFormValues(service: ServiceInfo): void {
		this.serviceForm.patchValue({
			id: service.id,
			name: service.name,
			description: service.description,
			// Guard against potential null/undefined seconds and convert backend seconds to minutes for the UI fields
			durationMinutes: (service.durationSeconds ?? 0) / 60,
			afterServiceBreakDurationMinutes: (service.afterServiceBreakDurationSeconds ?? 0) / 60,
		});
	}

	onSubmit(): void {
		console.log('Service Edit Submit Clicked. Form state:', {
			valid: this.serviceForm.valid,
			values: this.serviceForm.value,
			errors: this.serviceForm.errors,
		});

		if (this.serviceForm.invalid) {
			const invalidControls: string[] = [];
			const controls = this.serviceForm.controls;
			for (const name in controls) {
				if (controls[name].invalid) {
					invalidControls.push(name);
				}
			}
			console.warn('Service Edit Form validation failed on controls:', invalidControls);
			alert(`Cannot save service: some fields are invalid, nyaa~! :3\nInvalid fields: ${invalidControls.join(', ')}`);
			return;
		}

		const formRawValues = this.serviceForm.value;

		const payload: ServiceInfo = {
			id: this.isEditMode ? Number(formRawValues.id) : 0,
			name: formRawValues.name,
			description: formRawValues.description,
			durationSeconds: Number(formRawValues.durationMinutes) * 60,
			afterServiceBreakDurationSeconds: Number(formRawValues.afterServiceBreakDurationMinutes) * 60,
		};

		console.log('Sending Service Payload:', payload);

		if (this.isEditMode) {
			this.serviceService.putService(payload.id, payload).subscribe({
				next: (res) => {
					console.log('Service updated successfully!', res);
					alert('Service modified successfully, nyaa~! :3');
					this.router.navigate(['/']);
				},
				error: (err) => {
					console.error('Failed to update service', err);
					alert(`Oh no! Failed to update service, nyaa~!\nError: ${err.message || err.statusText || 'Unknown error'}`);
				},
			});
		} else {
			this.serviceService.postService(payload).subscribe({
				next: (res) => {
					console.log('Service created successfully!', res);
					alert('Service created successfully, nyaa~! :3');
					this.router.navigate(['/']);
				},
				error: (err) => {
					console.error('Failed to create service', err);
					alert(`Oh no! Failed to create service, nyaa~!\nError: ${err.message || err.statusText || 'Unknown error'}`);
				},
			});
		}
	}

	onCancel(): void {
		if (confirm('Discard changes?')) {
			this.router.navigate(['/']);
		}
	}
}
