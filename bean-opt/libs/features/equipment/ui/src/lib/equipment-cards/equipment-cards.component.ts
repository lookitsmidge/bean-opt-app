import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CoffeeMachine, CoffeeGrinder, Workflow, WorkflowStep, CoffeeEquipment } from '@boa/features/equipment/domain';

@Component({
  selector: 'lib-equipment-cards',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './equipment-cards.component.html',
  styleUrls: ['./equipment-cards.component.css']
})
export class EquipmentCardsComponent {
  @Input() type!: 'machine' | 'grinder' | 'setup' | 'workflow' | 'custom';
  @Input() items: any[] = [];
  @Input() machines: CoffeeMachine[] = [];
  @Input() grinders: CoffeeGrinder[] = [];
  @Input() customEquipments: CoffeeEquipment[] = [];

  @Output() editRequested = new EventEmitter<any>();
  @Output() deleteRequested = new EventEmitter<string>();

  getCustomEquipmentNames(equipmentIds: string[] | undefined): string[] {
    if (!equipmentIds || equipmentIds.length === 0) return [];
    return equipmentIds
      .map((id) => this.customEquipments.find((x) => x.id === id)?.name)
      .filter((name): name is string => !!name);
  }

  getMachineName(machineId: string | null): string {
    if (!machineId) return 'Direct Extraction (No Machine)';
    const m = this.machines.find((x) => x.id === machineId);
    return m ? `${m.name} ${m.manufacturer ? '(' + m.manufacturer + ')' : ''}` : 'Unknown Machine';
  }

  getGrinderName(grinderId: string | null): string {
    if (!grinderId) return 'Pre-ground Coffee';
    const g = this.grinders.find((x) => x.id === grinderId);
    return g ? `${g.name} ${g.manufacturer ? '(' + g.manufacturer + ')' : ''}` : 'Unknown Grinder';
  }

  getStepsByStage(workflow: Workflow, stage: 'Before' | 'During' | 'After'): WorkflowStep[] {
    return (workflow.steps || []).filter((s) => s.stage === stage);
  }
}
