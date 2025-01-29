import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreditCard } from '../../utils/app.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-credit-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './credit-card.component.html',
  styleUrl: './credit-card.component.css'
})
export class CreditCardComponent {

  @Input() creditCard! : CreditCard;

}
