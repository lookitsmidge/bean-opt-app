import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Coffee } from '@boa/features/coffees/domain';

@Component({
  selector: 'lib-coffee-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './coffee-card.component.html',
  styleUrls: ['./coffee-card.component.css']
})
export class CoffeeCardComponent {
  @Input() coffee!: Coffee;
  @Output() editRequested = new EventEmitter<Coffee>();
  @Output() deleteRequested = new EventEmitter<string>();
}
