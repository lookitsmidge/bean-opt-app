import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CoffeeStore } from '@boa/features/coffees/application';
import { AuthStore } from '@boa/core-auth-application';
import { CoffeeCardComponent } from '@boa/features/coffees/ui';
import { CoffeeFormDialogComponent } from './coffee-form-dialog.component';
import { Coffee, CoffeeTarget } from '@boa/features/coffees/domain';

@Component({
  selector: 'lib-beans-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    CoffeeCardComponent
  ],
  templateUrl: './beans-dashboard.component.html',
  styleUrls: ['./beans-dashboard.component.css']
})
export class BeansDashboardComponent implements OnInit {
  protected readonly store = inject(CoffeeStore);
  private readonly auth = inject(AuthStore);
  private readonly dialog = inject(MatDialog);

  ngOnInit() {
    const user = this.auth.user();
    if (user) {
      this.store.loadCoffees(user.uid);
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(CoffeeFormDialogComponent, {
      width: '450px',
      panelClass: 'm3-dialog-panel'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const user = this.auth.user();
        if (user) {
          const coffeeId = crypto.randomUUID();
          const targets = (result.targets || []).map((t: Partial<CoffeeTarget>) => ({
            id: t.id || crypto.randomUUID(),
            coffeeId,
            tasteProfile: t.tasteProfile || 'Standard',
            minYield: t.minYield !== undefined && t.minYield !== null ? Number(t.minYield) : null,
            maxYield: t.maxYield !== undefined && t.maxYield !== null ? Number(t.maxYield) : null,
            minPreinfusionTime: t.minPreinfusionTime !== undefined && t.minPreinfusionTime !== null ? Number(t.minPreinfusionTime) : null,
            maxPreinfusionTime: t.maxPreinfusionTime !== undefined && t.maxPreinfusionTime !== null ? Number(t.maxPreinfusionTime) : null,
            minExtractionTime: t.minExtractionTime !== undefined && t.minExtractionTime !== null ? Number(t.minExtractionTime) : null,
            maxExtractionTime: t.maxExtractionTime !== undefined && t.maxExtractionTime !== null ? Number(t.maxExtractionTime) : null,
            minFlowRate: t.minFlowRate !== undefined && t.minFlowRate !== null ? Number(t.minFlowRate) : null,
            maxFlowRate: t.maxFlowRate !== undefined && t.maxFlowRate !== null ? Number(t.maxFlowRate) : null,
            createdAt: t.createdAt || new Date().toISOString()
          }));

          const newCoffee: Coffee = {
            id: coffeeId,
            userId: user.uid,
            name: result.name,
            roaster: result.roaster || null,
            roastProfile: result.roastProfile || null,
            description: result.description || null,
            url: result.url || null,
            pricePerKg: result.pricePerKg !== undefined && result.pricePerKg !== null ? Number(result.pricePerKg) : null,
            notes: result.notes || null,
            active: true,
            createdAt: new Date().toISOString(),
            targets
          };
          this.store.addCoffee(newCoffee);
        }
      }
    });
  }

  openEditDialog(coffee: Coffee) {
    const dialogRef = this.dialog.open(CoffeeFormDialogComponent, {
      width: '450px',
      data: { coffee },
      panelClass: 'm3-dialog-panel'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const targets = (result.targets || []).map((t: Partial<CoffeeTarget>) => ({
          id: t.id || crypto.randomUUID(),
          coffeeId: coffee.id,
          tasteProfile: t.tasteProfile || 'Standard',
          minYield: t.minYield !== undefined && t.minYield !== null ? Number(t.minYield) : null,
          maxYield: t.maxYield !== undefined && t.maxYield !== null ? Number(t.maxYield) : null,
          minPreinfusionTime: t.minPreinfusionTime !== undefined && t.minPreinfusionTime !== null ? Number(t.minPreinfusionTime) : null,
          maxPreinfusionTime: t.maxPreinfusionTime !== undefined && t.maxPreinfusionTime !== null ? Number(t.maxPreinfusionTime) : null,
          minExtractionTime: t.minExtractionTime !== undefined && t.minExtractionTime !== null ? Number(t.minExtractionTime) : null,
          maxExtractionTime: t.maxExtractionTime !== undefined && t.maxExtractionTime !== null ? Number(t.maxExtractionTime) : null,
          minFlowRate: t.minFlowRate !== undefined && t.minFlowRate !== null ? Number(t.minFlowRate) : null,
          maxFlowRate: t.maxFlowRate !== undefined && t.maxFlowRate !== null ? Number(t.maxFlowRate) : null,
          createdAt: t.createdAt || new Date().toISOString()
        }));

        const updated: Coffee = {
          ...coffee,
          name: result.name,
          roaster: result.roaster || null,
          roastProfile: result.roastProfile || null,
          description: result.description || null,
          url: result.url || null,
          pricePerKg: result.pricePerKg !== undefined && result.pricePerKg !== null ? Number(result.pricePerKg) : null,
          notes: result.notes || null,
          active: result.active ?? coffee.active,
          targets
        };
        this.store.addCoffee(updated);
      }
    });
  }

  deleteCoffee(id: string) {
    if (confirm('Are you sure you want to delete this coffee bean bag?')) {
      this.store.deleteCoffee(id);
    }
  }
}
