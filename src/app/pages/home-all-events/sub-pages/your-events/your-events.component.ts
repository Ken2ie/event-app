import { Component, inject, OnInit } from '@angular/core';
import { EventCardComponent } from '../../../../shared/event-card/event-card.component';
import { PaymentService } from '../../../../services/payment/payment.service';
import { Payment } from '../../../../utils/app.interface';

@Component({
  selector: 'app-your-events',
  standalone: true,
  imports: [EventCardComponent],
  templateUrl: './your-events.component.html',
  styleUrl: './your-events.component.css'
})
export class YourEventsComponent implements OnInit{

  paymentService = inject(PaymentService);

  allTickets :  Array<Payment> = []

  ngOnInit(): void {
    this.getAllPayedTickets()
  }

  getAllPayedTickets(){
    this.allTickets = this.paymentService.getAllPayments()
  }

}
