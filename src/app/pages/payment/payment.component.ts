import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsDataService } from '../../services/events-data/events-data.service';
import { CreditCardComponent } from "../../shared/credit-card/credit-card.component";
import { CreditCard, Event, Payment } from '../../utils/app.interface';
import { CommonModule } from '@angular/common';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { CardFormComponent } from './add-card.component';
import { CreditCardService } from '../../services/credit-card/credit-card.service';
import { PaymentService } from '../../services/payment/payment.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CreditCardComponent, CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentComponent implements OnInit{

  route = inject(ActivatedRoute)
  eventDataService = inject(EventsDataService)
  creditCardService = inject(CreditCardService)
  dialog = inject(MatDialog)
  paymentService = inject(PaymentService);
  router = inject(Router);

  event! : Event ;
  selectedTicket! : any ;
  cards : CreditCard[] = []
  selectedCard: CreditCard | null = null;
  securityCode: string = '';
  totalAmount: number = 0;

  ngOnInit(): void {
    this.getPaymentData();
    this.getAllCards()

    const defaultCard = this.creditCardService.getDefaultCard();
    if (defaultCard) {
      this.selectedCard = defaultCard;
    }
  }

  getPaymentData(){
    this.route.queryParams.subscribe({
      next: (params : any) => {        
        this.selectedTicket = params;
        this.eventDataService.getAnEventById(params.eventId).subscribe({
           next: (event: any) => {
             this.event = event;             
           }
         })
      }
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(CardFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.getAllCards()
    });
  }

  getAllCards(){
    this.cards = this.creditCardService.getAllCards()
  }

  processPayment() {
    if (!this.selectedCard || !this.securityCode || !this.event) {
       alert("Please enter the CVV for your card!")
       return;
    }

    // Create payment object
    const payment: Payment = {
      event: this.event,
      ticket: this.selectedTicket,
      quantity: parseInt(this.selectedTicket.quantity),
      paid: true
    };

    try{
      this.paymentService.addToEvents(payment);
      this.router.navigate([''])
    } catch (error) {
      alert(error)
    }
   
  }

  isPaymentValid(): boolean {
    if(
      this.selectedCard && 
      this.securityCode?.length >= 3 && 
      this.totalAmount > 0
    ){
      return true;
    } else return false
  }

  selectCard(card: CreditCard) {
    this.selectedCard = card;
    this.securityCode = ''; 
  }

  cancelOrder(){
    this.router.navigate([''])
  }

}
