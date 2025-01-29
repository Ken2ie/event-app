import { Injectable } from '@angular/core';
import { Payment } from '../../utils/app.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly storageKey = 'payments';

  constructor() { }

  addToEvents(payment: Payment): void {
    const payments = this.getAllPayments();
    payments.push(payment);
    localStorage.setItem(this.storageKey, JSON.stringify(payments));
  }

  getAllPayments(): Payment[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }
}
