import { Component, input } from '@angular/core';
import { ServiceInfo } from '../../dataaccess/service-info';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-service-edit',
	imports: [ ReactiveFormsModule ],
	templateUrl: './service-edit.html',
	styleUrl: './service-edit.scss',
})
export class ServiceEdit {
	serviceToEdit = input<ServiceInfo>({
		id: 0,
		name: '',
		description: '',
		durationSeconds: 0,
		afterServiceBreakDurationSeconds: 0,
	});

	serviceForm!: FormGroup;
	isEditMode = false;

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {
		this.initForm();

		if (this.serviceToEdit) {
			this.isEditMode = true;
			this.loadFormValues(this.serviceToEdit());
		}
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

		// Map UI minute values back into the ServiceInfo standard seconds structure
		const payload: ServiceInfo = {
			id: formRawValues.id || 0, // 0 or handle backend assignment if creating new
			name: formRawValues.name,
			description: formRawValues.description,
			durationSeconds: formRawValues.durationMinutes * 60,
			afterServiceBreakDurationSeconds: formRawValues.afterServiceBreakDurationMinutes * 60,
		};

		console.log('Formatted ServiceInfo Payload:', payload);
		// Send payload to your Angular Service (e.g., this.myService.save(payload))
	}

	onCancel(): void {
		if (confirm('Discard changes?')) {
			this.serviceForm.reset();
		}
	}
}
