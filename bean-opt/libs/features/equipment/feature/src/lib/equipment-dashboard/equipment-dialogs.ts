import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CoffeeMachine, CoffeeGrinder, Setup, Workflow, CoffeeEquipment } from '@boa/features/equipment/domain';

// ==========================================
// 1. MACHINE FORM DIALOG
// ==========================================
@Component({
  selector: 'lib-machine-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule],
  template: `
    <h2 mat-dialog-title class="font-black uppercase tracking-wider text-slate-800 m-0 pb-2 border-b border-solid border-slate-100">
      {{ isEditMode ? 'Edit Machine' : 'Add Machine' }}
    </h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content class="space-y-4 pt-6 pb-2 min-w-[320px]">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Machine Name</mat-label>
          <input matInput formControlName="name" placeholder="Gaggia Classic">
          <mat-error>Name is required</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Manufacturer</mat-label>
          <input matInput formControlName="manufacturer" placeholder="La Marzocco">
        </mat-form-field>
        @if (isEditMode) {
          <div class="flex items-center justify-between py-2 border-t border-solid border-slate-50 mt-4">
            <span class="text-xs font-black uppercase tracking-wider text-slate-500">Status</span>
            <mat-slide-toggle formControlName="active">Active Equipment</mat-slide-toggle>
          </div>
        }
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="gap-2 pt-4 border-t border-solid border-slate-100">
        <button mat-button type="button" (click)="cancel()" class="uppercase tracking-widest text-xs font-black text-slate-500">Abort</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid" class="uppercase tracking-widest text-xs font-black px-6 py-2 rounded-xl">
          Save
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class MachineFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MachineFormDialogComponent>);
  private data = inject<{ machine?: CoffeeMachine }>(MAT_DIALOG_DATA, { optional: true });

  form!: FormGroup;
  isEditMode = false;

  ngOnInit() {
    this.isEditMode = !!this.data?.machine;
    const m = this.data?.machine;
    this.form = this.fb.group({
      name: [m?.name || '', Validators.required],
      manufacturer: [m?.manufacturer || ''],
      active: [m?.active ?? true]
    });
  }

  submit() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}

// ==========================================
// 2. GRINDER FORM DIALOG
// ==========================================
@Component({
  selector: 'lib-grinder-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule],
  template: `
    <h2 mat-dialog-title class="font-black uppercase tracking-wider text-slate-800 m-0 pb-2 border-b border-solid border-slate-100">
      {{ isEditMode ? 'Edit Grinder' : 'Add Grinder' }}
    </h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content class="space-y-4 pt-6 pb-2 min-w-[320px]">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Grinder Name</mat-label>
          <input matInput formControlName="name" placeholder="Niche Zero">
          <mat-error>Name is required</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Manufacturer</mat-label>
          <input matInput formControlName="manufacturer" placeholder="Niche">
        </mat-form-field>
        @if (isEditMode) {
          <div class="flex items-center justify-between py-2 border-t border-solid border-slate-50 mt-4">
            <span class="text-xs font-black uppercase tracking-wider text-slate-500">Status</span>
            <mat-slide-toggle formControlName="active">Active Equipment</mat-slide-toggle>
          </div>
        }
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="gap-2 pt-4 border-t border-solid border-slate-100">
        <button mat-button type="button" (click)="cancel()" class="uppercase tracking-widest text-xs font-black text-slate-500">Abort</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid" class="uppercase tracking-widest text-xs font-black px-6 py-2 rounded-xl">
          Save
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class GrinderFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<GrinderFormDialogComponent>);
  private data = inject<{ grinder?: CoffeeGrinder }>(MAT_DIALOG_DATA, { optional: true });

  form!: FormGroup;
  isEditMode = false;

  ngOnInit() {
    this.isEditMode = !!this.data?.grinder;
    const g = this.data?.grinder;
    this.form = this.fb.group({
      name: [g?.name || '', Validators.required],
      manufacturer: [g?.manufacturer || ''],
      active: [g?.active ?? true]
    });
  }

  submit() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}

// ==========================================
// 3. SETUP FORM DIALOG
// ==========================================
@Component({
  selector: 'lib-setup-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatSlideToggleModule],
  template: `
    <h2 mat-dialog-title class="font-black uppercase tracking-wider text-slate-800 m-0 pb-2 border-b border-solid border-slate-100">
      {{ isEditMode ? 'Edit Setup' : 'Create Setup' }}
    </h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content class="space-y-4 pt-6 pb-2 min-w-[320px]">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Setup Profile Name</mat-label>
          <input matInput formControlName="name" placeholder="My Kitchen Bar">
          <mat-error>Name is required</mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Active Espresso Machine</mat-label>
          <mat-select formControlName="machineId">
            <mat-option [value]="null">No Machine Selected</mat-option>
            @for (m of machines; track m.id) {
              <mat-option [value]="m.id">{{ m.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Active Grinder</mat-label>
          <mat-select formControlName="grinderId">
            <mat-option [value]="null">No Grinder Selected</mat-option>
            @for (g of grinders; track g.id) {
              <mat-option [value]="g.id">{{ g.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Custom Tools / Accessories</mat-label>
          <mat-select formControlName="equipmentIds" multiple>
            @for (eq of customEquipments; track eq.id) {
              <mat-option [value]="eq.id">{{ eq.name }} ({{ eq.type }})</mat-option>
            }
          </mat-select>
        </mat-form-field>

        @if (isEditMode) {
          <div class="flex items-center justify-between py-2 border-t border-solid border-slate-50 mt-4">
            <span class="text-xs font-black uppercase tracking-wider text-slate-500">Status</span>
            <mat-slide-toggle formControlName="active">Active Setup</mat-slide-toggle>
          </div>
        }
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="gap-2 pt-4 border-t border-solid border-slate-100">
        <button mat-button type="button" (click)="cancel()" class="uppercase tracking-widest text-xs font-black text-slate-500">Abort</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid" class="uppercase tracking-widest text-xs font-black px-6 py-2 rounded-xl">
          Save
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class SetupFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SetupFormDialogComponent>);
  private data = inject<{ setup?: Setup; machines: CoffeeMachine[]; grinders: CoffeeGrinder[]; customEquipments?: CoffeeEquipment[] }>(MAT_DIALOG_DATA);

  form!: FormGroup;
  isEditMode = false;
  machines: CoffeeMachine[] = [];
  grinders: CoffeeGrinder[] = [];
  customEquipments: CoffeeEquipment[] = [];

  ngOnInit() {
    this.isEditMode = !!this.data?.setup;
    this.machines = this.data?.machines || [];
    this.grinders = this.data?.grinders || [];
    this.customEquipments = this.data?.customEquipments || [];
    const s = this.data?.setup;

    this.form = this.fb.group({
      name: [s?.name || '', Validators.required],
      machineId: [s?.machineId || null],
      grinderId: [s?.grinderId || null],
      equipmentIds: [s?.equipmentIds || []],
      active: [s?.active ?? true]
    });
  }

  submit() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}

// ==========================================
// 4. WORKFLOW FORM DIALOG
// ==========================================
@Component({
  selector: 'lib-workflow-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCheckboxModule, MatSlideToggleModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="font-black uppercase tracking-wider text-slate-800 m-0 pb-2 border-b border-solid border-slate-100">
      {{ isEditMode ? 'Edit Workflow' : 'Create Workflow' }}
    </h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content class="space-y-4 pt-6 pb-2 min-w-[350px] max-h-[60vh] overflow-y-auto custom-scrollbar">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Workflow Name</mat-label>
          <input matInput formControlName="name" placeholder="E.g., High Preinfusion Profile">
          <mat-error>Name is required</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="2" placeholder="Describe workflow targets..."></textarea>
        </mat-form-field>

        <div class="border-t border-solid border-slate-100 pt-4">
          <div class="flex justify-between items-center mb-3">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Steps Sequence</span>
            <button mat-button type="button" (click)="addStep()" class="uppercase tracking-widest text-[9px] font-black hover:bg-slate-50 px-3 py-1">
              Add Step
            </button>
          </div>

          <div formArrayName="steps" class="space-y-3">
            @for (step of steps.controls; let idx = $index; track idx) {
              <div [formGroupName]="idx" 
                   class="flex flex-col gap-2 p-3 bg-slate-50/50 border border-solid border-slate-100 rounded-2xl relative">
                <button type="button" (click)="removeStep(idx)" 
                        class="absolute right-2 top-2 p-1 text-slate-400 hover:text-rose-500 border-none bg-transparent cursor-pointer">
                  <mat-icon class="scale-75">close</mat-icon>
                </button>

                <span class="text-[10px] font-extrabold text-slate-400">Step #{{ idx + 1 }}</span>

                <div class="flex flex-col gap-2">
                  <div class="grid grid-cols-3 gap-2">
                    <mat-form-field appearance="outline" class="col-span-1">
                      <mat-label>Stage</mat-label>
                      <mat-select formControlName="stage">
                        <mat-option value="Before">Before</mat-option>
                        <mat-option value="During">During</mat-option>
                        <mat-option value="After">After</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="col-span-2">
                      <mat-label>Step Title</mat-label>
                      <input matInput formControlName="title" placeholder="E.g., Puck Prep">
                      <mat-error>Required</mat-error>
                    </mat-form-field>
                  </div>

                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Instructions</mat-label>
                    <textarea matInput formControlName="instructions" rows="2" placeholder="WDT distribute and tamp evenly..."></textarea>
                    <mat-error>Required</mat-error>
                  </mat-form-field>
                </div>

                <div class="flex items-center gap-2">
                  <mat-checkbox formControlName="important">Important (Highlight)</mat-checkbox>
                </div>
              </div>
            }
          </div>
        </div>

        @if (isEditMode) {
          <div class="flex items-center justify-between py-2 border-t border-solid border-slate-50 mt-4">
            <span class="text-xs font-black uppercase tracking-wider text-slate-500">Status</span>
            <mat-slide-toggle formControlName="active">Active Workflow</mat-slide-toggle>
          </div>
        }
      </mat-dialog-content>
      
      <mat-dialog-actions align="end" class="gap-2 pt-4 border-t border-solid border-slate-100">
        <button mat-button type="button" (click)="cancel()" class="uppercase tracking-widest text-xs font-black text-slate-500">Abort</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid" class="uppercase tracking-widest text-xs font-black px-6 py-2 rounded-xl">
          Save
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class WorkflowFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<WorkflowFormDialogComponent>);
  private data = inject<{ workflow?: Workflow }>(MAT_DIALOG_DATA, { optional: true });

  form!: FormGroup;
  isEditMode = false;

  get steps() {
    return this.form.get('steps') as FormArray;
  }

  ngOnInit() {
    this.isEditMode = !!this.data?.workflow;
    const w = this.data?.workflow;

    this.form = this.fb.group({
      name: [w?.name || '', Validators.required],
      description: [w?.description || ''],
      active: [w?.active ?? true],
      steps: this.fb.array([])
    });

    if (w?.steps && w.steps.length > 0) {
      w.steps.forEach((step) => {
        this.steps.push(this.fb.group({
          id: [step.id],
          stage: [step.stage, Validators.required],
          title: [step.title, Validators.required],
          instructions: [step.instructions, Validators.required],
          important: [step.important],
          createdAt: [step.createdAt]
        }));
      });
    } else if (!this.isEditMode) {
      this.addStep();
    }
  }

  addStep() {
    this.steps.push(this.fb.group({
      id: [null],
      stage: ['Before', Validators.required],
      title: ['', Validators.required],
      instructions: ['', Validators.required],
      important: [false],
      createdAt: [new Date().toISOString()]
    }));
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  submit() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}

// ==========================================
// 5. CUSTOM EQUIPMENT FORM DIALOG
// ==========================================
@Component({
  selector: 'lib-custom-equipment-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatSlideToggleModule],
  template: `
    <h2 mat-dialog-title class="font-black uppercase tracking-wider text-slate-800 m-0 pb-2 border-b border-solid border-slate-100">
      {{ isEditMode ? 'Edit Tool' : 'Add Custom Tool' }}
    </h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content class="space-y-4 pt-6 pb-2 min-w-[320px]">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Tool / Accessory Name</mat-label>
          <input matInput formControlName="name" placeholder="E.g., IMS High Flow Rate Basket">
          <mat-error>Name is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Type</mat-label>
          <mat-select formControlName="type">
            @for (type of equipmentTypes; track type) {
              <mat-option [value]="type">{{ type }}</mat-option>
            }
          </mat-select>
          <mat-error>Type is required</mat-error>
        </mat-form-field>

        @if (isEditMode) {
          <div class="flex items-center justify-between py-2 border-t border-solid border-slate-50 mt-4">
            <span class="text-xs font-black uppercase tracking-wider text-slate-500">Status</span>
            <mat-slide-toggle formControlName="active">Active Tool</mat-slide-toggle>
          </div>
        }
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="gap-2 pt-4 border-t border-solid border-slate-100">
        <button mat-button type="button" (click)="cancel()" class="uppercase tracking-widest text-xs font-black text-slate-500">Abort</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid" class="uppercase tracking-widest text-xs font-black px-6 py-2 rounded-xl">
          Save
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class CustomEquipmentFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CustomEquipmentFormDialogComponent>);
  private data = inject<{ equipment?: CoffeeEquipment }>(MAT_DIALOG_DATA, { optional: true });

  form!: FormGroup;
  isEditMode = false;
  equipmentTypes = ['Basket', 'Portafilter', 'Shaker', 'Tamper', 'WDT', 'Scale', 'Other'];

  ngOnInit() {
    this.isEditMode = !!this.data?.equipment;
    const eq = this.data?.equipment;
    this.form = this.fb.group({
      name: [eq?.name || '', Validators.required],
      type: [eq?.type || 'Basket', Validators.required],
      active: [eq?.active ?? true]
    });
  }

  submit() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}

