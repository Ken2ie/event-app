import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreditCardService, CreditCard } from '../../services/credit-card/credit-card.service';
import { NgIf } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-card-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  template: `
    <form [formGroup]="cardForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="cardNumber">Card Number</label>
        <input
          id="cardNumber"
          type="text"
          formControlName="cardNumber"
          (input)="onCardNumberChange($event)"
          placeholder="**** **** **** ****"
        >
        <div *ngIf="cardForm.get('cardNumber')?.errors?.['required'] && cardForm.get('cardNumber')?.touched">
          Card number is required
        </div>
        <div *ngIf="cardForm.get('cardNumber')?.errors?.['invalid']">
          Invalid card number
        </div>
      </div>

      <div class="form-group">
        <label for="cardHolder">Card Holder Name</label>
        <input
          id="cardHolder"
          type="text"
          formControlName="cardHolder"
          placeholder="Name on card"
        >
        <div *ngIf="cardForm.get('cardHolder')?.errors?.['required'] && cardForm.get('cardHolder')?.touched">
          Card holder name is required
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="expirationDate">Expiration Date</label>
          <input
            id="expirationDate"
            type="text"
            formControlName="expirationDate"
            placeholder="MM/YY"
            (input)="formatExpirationDate($event)"
          >
          <div *ngIf="cardForm.get('expirationDate')?.errors?.['required'] && cardForm.get('expirationDate')?.touched">
            Expiration date is required
          </div>
          <div *ngIf="cardForm.get('expirationDate')?.errors?.['invalid']">
            Invalid expiration date
          </div>
        </div>

        <div class="form-group">
          <label for="cvv">CVV</label>
          <input
            id="cvv"
            type="password"
            formControlName="cvv"
            maxlength="4"
            placeholder="***"
          >
          <div *ngIf="cardForm.get('cvv')?.errors?.['required'] && cardForm.get('cvv')?.touched">
            CVV is required
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>
          <input type="checkbox" formControlName="isDefault">
          Set as default card
        </label>
      </div>

      <button type="submit" [disabled]="cardForm.invalid">
        {{ editMode ? 'Update Card' : 'Add Card' }}
      </button>
    </form>
  `,
  styles: [`
    form{
      padding: 20px
    }

    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-row {
      display: flex;
      gap: 1rem;
    }
    
    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    
    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #2e7d32;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:disabled {
      background-color: #ccc;
    }
    
    .error-message {
      color: red;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardFormComponent {
  @Input() editMode = false;
  @Input() cardToEdit?: CreditCard;
  @Output() formSubmit = new EventEmitter<CreditCard>();
  @Output() cancel = new EventEmitter<void>();

  readonly dialogRef = inject(MatDialogRef<CardFormComponent>);
  cardService = inject(CreditCardService)

  cardForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private creditCardService: CreditCardService
  ) {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required]],
      cardHolder: ['', [Validators.required]],
      expirationDate: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.minLength(3)]],
      isDefault: [false]
    });
  }

  ngOnInit() {
    if (this.editMode && this.cardToEdit) {
      this.cardForm.patchValue({
        cardHolder: this.cardToEdit.cardHolder,
        expirationDate: this.cardToEdit.expirationDate,
        isDefault: this.cardToEdit.isDefault
      });
    }
  }

  onCardNumberChange(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    
    event.target.value = value;
    
    const isValid = this.creditCardService.validateCardNumber(value);
    if (!isValid) {
      this.cardForm.get('cardNumber')?.setErrors({ invalid: true });
    }
  }

  formatExpirationDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    event.target.value = value;
    
    const isValid = this.creditCardService.validateExpirationDate(value);
    if (!isValid) {
      this.cardForm.get('expirationDate')?.setErrors({ invalid: true });
    }
  }

  onSubmit() {
    if (this.cardForm.valid) {
      const formValue = this.cardForm.value;
      
      const cardData: CreditCard = {
        id: this.editMode && this.cardToEdit ? this.cardToEdit.id : this.creditCardService.generateId(),
        cardNumber: formValue.cardNumber,
        cardHolder: formValue.cardHolder,
        expirationDate: formValue.expirationDate,
        cvv: formValue.cvv,
        type: this.creditCardService.detectCardType(formValue.cardNumber) || 'visa',
        lastFourDigits: formValue.cardNumber.slice(-4),
        isDefault: formValue.isDefault
      };
``
      this.cardService.addCard(cardData);
      this.dialogRef.close();
    }
  }
}