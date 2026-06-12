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
			// Convert backend seconds to minutes for the UI fields
			durationMinutes: service.durationSeconds / 60,
			afterServiceBreakDurationMinutes: service.afterServiceBreakDurationSeconds / 60,
		});
	}

	onSubmit(): void {
		if (this.serviceForm.invalid) {
			this.serviceForm.markAllAsTouched();
			return;
		}

		const formRawValues = this.serviceForm.value;

		const payload: Omit<ServiceInfo, 'id'> & { id?: number } = {
			name: formRawValues.name,
			description: formRawValues.description,
			durationSeconds: formRawValues.durationMinutes * 60,
			afterServiceBreakDurationSeconds: formRawValues.afterServiceBreakDurationMinutes * 60,
		};

		if (this.isEditMode) {
			const id = Number(formRawValues.id);
			payload.id = id;
			this.serviceService.putService(id, payload as any).subscribe({
				next: () => {
					this.router.navigate(['/']);
				},
				error: (err) => console.error('Failed to update service', err),
			});
		} else {
			this.serviceService.postService(payload as any).subscribe({
				next: () => {
					this.router.navigate(['/']);
				},
				error: (err) => console.error('Failed to create service', err),
			});
		}
	}

	onCancel(): void {
		if (confirm('Discard changes?')) {
			this.router.navigate(['/']);
		}
	}
}
