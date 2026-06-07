import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthStore } from '@boa/core-auth-application';
import {
  CoffeeMachineStore,
  CoffeeGrinderStore,
  SetupStore,
  WorkflowStore,
  CoffeeEquipmentStore
} from '@boa/features/equipment/application';
import {
  CoffeeMachine,
  CoffeeGrinder,
  Setup,
  Workflow,
  WorkflowStep,
  CoffeeEquipment
} from '@boa/features/equipment/domain';
import {
  MachineFormDialogComponent,
  GrinderFormDialogComponent,
  SetupFormDialogComponent,
  WorkflowFormDialogComponent,
  CustomEquipmentFormDialogComponent
} from './equipment-dialogs';
import { EquipmentCardsComponent } from '@boa/features/equipment/ui';

@Component({
  selector: 'lib-equipment-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    EquipmentCardsComponent
  ],
  templateUrl: './equipment-dashboard.component.html',
  styleUrls: ['./equipment-dashboard.component.css']
})
export class EquipmentDashboardComponent implements OnInit {
  protected readonly machineStore = inject(CoffeeMachineStore);
  protected readonly grinderStore = inject(CoffeeGrinderStore);
  protected readonly setupStore = inject(SetupStore);
  protected readonly workflowStore = inject(WorkflowStore);
  protected readonly customEquipmentStore = inject(CoffeeEquipmentStore);
  private readonly auth = inject(AuthStore);
  private readonly dialog = inject(MatDialog);

  ngOnInit() {
    const user = this.auth.user();
    if (user) {
      this.machineStore.loadMachines(user.uid);
      this.grinderStore.loadGrinders(user.uid);
      this.setupStore.loadSetups(user.uid);
      this.workflowStore.loadWorkflows(user.uid);
      this.customEquipmentStore.loadEquipments(user.uid);
    }
  }

  // --- Coffee Machine Dialogs ---
  openAddMachine() {
    const dialogRef = this.dialog.open(MachineFormDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((res) => {
      const user = this.auth.user();
      if (res && user) {
        this.machineStore.addMachine({
          id: crypto.randomUUID(),
          userId: user.uid,
          name: res.name,
          manufacturer: res.manufacturer || null,
          active: true,
          createdAt: new Date().toISOString()
        });
      }
    });
  }

  openEditMachine(machine: CoffeeMachine) {
    const dialogRef = this.dialog.open(MachineFormDialogComponent, { width: '400px', data: { machine } });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.machineStore.addMachine({
          ...machine,
          name: res.name,
          manufacturer: res.manufacturer || null,
          active: res.active ?? machine.active
        });
      }
    });
  }

  deleteMachine(id: string) {
    if (confirm('Delete this coffee machine?')) {
      this.machineStore.deleteMachine(id);
    }
  }

  // --- Grinder Dialogs ---
  openAddGrinder() {
    const dialogRef = this.dialog.open(GrinderFormDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((res) => {
      const user = this.auth.user();
      if (res && user) {
        this.grinderStore.addGrinder({
          id: crypto.randomUUID(),
          userId: user.uid,
          name: res.name,
          manufacturer: res.manufacturer || null,
          active: true,
          createdAt: new Date().toISOString()
        });
      }
    });
  }

  openEditGrinder(grinder: CoffeeGrinder) {
    const dialogRef = this.dialog.open(GrinderFormDialogComponent, { width: '400px', data: { grinder } });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.grinderStore.addGrinder({
          ...grinder,
          name: res.name,
          manufacturer: res.manufacturer || null,
          active: res.active ?? grinder.active
        });
      }
    });
  }

  deleteGrinder(id: string) {
    if (confirm('Delete this grinder?')) {
      this.grinderStore.deleteGrinder(id);
    }
  }

  // --- Setup Dialogs ---
  openAddSetup() {
    const dialogRef = this.dialog.open(SetupFormDialogComponent, {
      width: '400px',
      data: {
        machines: this.machineStore.items(),
        grinders: this.grinderStore.items(),
        customEquipments: this.customEquipmentStore.items()
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      const user = this.auth.user();
      if (res && user) {
        this.setupStore.addSetup({
          id: crypto.randomUUID(),
          userId: user.uid,
          name: res.name,
          machineId: res.machineId || null,
          grinderId: res.grinderId || null,
          equipmentIds: res.equipmentIds || [],
          active: true,
          createdAt: new Date().toISOString()
        });
      }
    });
  }

  openEditSetup(setup: Setup) {
    const dialogRef = this.dialog.open(SetupFormDialogComponent, {
      width: '400px',
      data: {
        setup,
        machines: this.machineStore.items(),
        grinders: this.grinderStore.items(),
        customEquipments: this.customEquipmentStore.items()
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.setupStore.addSetup({
          ...setup,
          name: res.name,
          machineId: res.machineId || null,
          grinderId: res.grinderId || null,
          equipmentIds: res.equipmentIds || [],
          active: res.active ?? setup.active
        });
      }
    });
  }

  deleteSetup(id: string) {
    if (confirm('Delete this setup?')) {
      this.setupStore.deleteSetup(id);
    }
  }

  // --- Workflow Dialogs ---
  openAddWorkflow() {
    const dialogRef = this.dialog.open(WorkflowFormDialogComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe((res) => {
      const user = this.auth.user();
      if (res && user) {
        const workflowId = crypto.randomUUID();
        const steps = (res.steps || []).map((s: Partial<WorkflowStep>, idx: number) => ({
          id: crypto.randomUUID(),
          workflowId,
          stepNumber: idx + 1,
          stage: s.stage || 'Before',
          title: s.title || '',
          instructions: s.instructions || '',
          important: !!s.important,
          createdAt: new Date().toISOString()
        }));

        this.workflowStore.addWorkflow({
          id: workflowId,
          userId: user.uid,
          name: res.name,
          description: res.description || null,
          active: true,
          createdAt: new Date().toISOString(),
          steps
        });
      }
    });
  }

  openEditWorkflow(workflow: Workflow) {
    const dialogRef = this.dialog.open(WorkflowFormDialogComponent, { width: '500px', data: { workflow } });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        const steps = (res.steps || []).map((s: Partial<WorkflowStep>, idx: number) => ({
          id: s.id || crypto.randomUUID(),
          workflowId: workflow.id,
          stepNumber: idx + 1,
          stage: s.stage || 'Before',
          title: s.title || '',
          instructions: s.instructions || '',
          important: !!s.important,
          createdAt: s.createdAt || new Date().toISOString()
        }));

        this.workflowStore.addWorkflow({
          ...workflow,
          name: res.name,
          description: res.description || null,
          active: res.active ?? workflow.active,
          steps
        });
      }
    });
  }

  deleteWorkflow(id: string) {
    if (confirm('Delete this workflow?')) {
      this.workflowStore.deleteWorkflow(id);
    }
  }

  // --- Custom Equipment Dialogs ---
  openAddCustomEquipment() {
    const dialogRef = this.dialog.open(CustomEquipmentFormDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((res) => {
      const user = this.auth.user();
      if (res && user) {
        this.customEquipmentStore.addEquipment({
          id: crypto.randomUUID(),
          userId: user.uid,
          name: res.name,
          type: res.type,
          active: true,
          createdAt: new Date().toISOString()
        });
      }
    });
  }

  openEditCustomEquipment(equipment: CoffeeEquipment) {
    const dialogRef = this.dialog.open(CustomEquipmentFormDialogComponent, { width: '400px', data: { equipment } });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.customEquipmentStore.addEquipment({
          ...equipment,
          name: res.name,
          type: res.type,
          active: res.active ?? equipment.active
        });
      }
    });
  }

  deleteCustomEquipment(id: string) {
    if (confirm('Delete this custom tool?')) {
      this.customEquipmentStore.deleteEquipment(id);
    }
  }
}
