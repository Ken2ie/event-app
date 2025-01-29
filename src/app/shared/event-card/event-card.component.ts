import { Component, Input } from '@angular/core';
import { Event, Payment } from '../../utils/app.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {

  @Input() event! : Event;
  @Input() payemnt! : Payment;

}
