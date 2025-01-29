import { Component, inject, OnInit } from '@angular/core';
import { Timeline, TimelineModule } from 'primeng/timeline';
import { Event, TicketTier } from '../../../utils/app.interface';
import { EventCardComponent } from '../../../shared/event-card/event-card.component';
import { EventsDataService } from '../../../services/events-data/events-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-filtered-events',
  standalone: true,
  imports: [
    TimelineModule,
    EventCardComponent,
    CommonModule,
    FormsModule,
    NgFor,
    DialogModule,
  ],
  templateUrl: './filtered-events.component.html',
  styleUrl: './filtered-events.component.css',
  providers: [ConfirmationService],
})
export class FilteredEventsComponent implements OnInit {
  events: Event[] = [];
  selectedEvent: Event | undefined;
  selectedTicket: TicketTier | undefined;
  quantity: number = 1;

  evensDataService = inject(EventsDataService);
  route = inject(ActivatedRoute);
  confirmationService = inject(ConfirmationService);
  router = inject(Router);

  position!: string;
  visible!: boolean;
  quantityTimesPrice: number = 0;

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: (params: any) => {
        this.getEventsByType(params.type);
      },
    });
  }

  getEventsByType(eventType: string) {
    this.evensDataService.getEventsByType(eventType).subscribe({
      next: (results: Event[]) => {
        this.events = results;
      },
    });
  }

  openEventSideDialog(event: Event) {
    this.selectedEvent = event;
    this.selectedTicket = undefined; 
    this.quantity = 1; 
    this.quantityTimesPrice = 0;
    this.showDialog('right');
  }

  showDialog(position: string) {
    this.position = position;
    this.visible = true;
  }

  updatePrice() {
    if (this.selectedTicket && this.quantity > 0) {
      this.quantityTimesPrice = this.selectedTicket.price * this.quantity;
    } else {
      this.quantityTimesPrice = 0;
    }
  }

  onTicketSelect(ticket: TicketTier) {
    this.selectedTicket = ticket;
    this.updatePrice();
  }

  onQuantityChange() {
    this.updatePrice();
  }

  makePayment() {
    this.router.navigate(['/payment'], {
      queryParams: { eventId: this.selectedEvent?.id, quantity :this.quantity, ticketType: this.selectedTicket?.price },
    }); 
  }
}