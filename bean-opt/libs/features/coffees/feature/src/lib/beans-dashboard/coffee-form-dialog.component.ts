import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Coffee } from '@boa/features/coffees/domain';

@Component({
  selector: 'lib-coffee-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './coffee-form-dialog.component.html',
})
export class CoffeeFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CoffeeFormDialogComponent>);
  private readonly data = inject<{ coffee?: Coffee }>(MAT_DIALOG_DATA, { optional: true });

  form!: FormGroup;
  isEditMode = false;

  get targets() {
    return this.form.get('targets') as FormArray;
  }

  ngOnInit() {
    this.isEditMode = !!this.data?.coffee;
    const coffee = this.data?.coffee;

    this.form = this.fb.group({
      name: [coffee?.name || '', [Validators.required]],
      roaster: [coffee?.roaster || ''],
      roastProfile: [coffee?.roastProfile || 'medium', [Validators.required]],
      description: [coffee?.description || ''],
      url: [coffee?.url || ''],
      pricePerKg: [coffee?.pricePerKg !== undefined && coffee?.pricePerKg !== null ? coffee.pricePerKg : null, [Validators.min(0)]],
      notes: [coffee?.notes || ''],
      active: [coffee?.active ?? true],
      targets: this.fb.array([])
    });

    if (coffee?.targets && coffee.targets.length > 0) {
      coffee.targets.forEach((target) => {
        this.targets.push(this.fb.group({
          id: [target.id],
          tasteProfile: [target.tasteProfile, [Validators.required]],
          minYield: [target.minYield, [Validators.min(0)]],
          maxYield: [target.maxYield, [Validators.min(0)]],
          minPreinfusionTime: [target.minPreinfusionTime, [Validators.min(0)]],
          maxPreinfusionTime: [target.maxPreinfusionTime, [Validators.min(0)]],
          minExtractionTime: [target.minExtractionTime, [Validators.min(0)]],
          maxExtractionTime: [target.maxExtractionTime, [Validators.min(0)]],
          minFlowRate: [target.minFlowRate, [Validators.min(0)]],
          maxFlowRate: [target.maxFlowRate, [Validators.min(0)]],
          createdAt: [target.createdAt]
        }));
      });
    }
  }

  addTarget() {
    this.targets.push(this.fb.group({
      id: [crypto.randomUUID()],
      tasteProfile: ['', [Validators.required]],
      minYield: [null, [Validators.min(0)]],
      maxYield: [null, [Validators.min(0)]],
      minPreinfusionTime: [null, [Validators.min(0)]],
      maxPreinfusionTime: [null, [Validators.min(0)]],
      minExtractionTime: [null, [Validators.min(0)]],
      maxExtractionTime: [null, [Validators.min(0)]],
      minFlowRate: [null, [Validators.min(0)]],
      maxFlowRate: [null, [Validators.min(0)]],
      createdAt: [new Date().toISOString()]
    }));
  }

  removeTarget(index: number) {
    this.targets.removeAt(index);
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
