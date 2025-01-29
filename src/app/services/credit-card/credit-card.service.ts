import { Injectable } from '@angular/core';

export interface CreditCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expirationDate: string;
  cvv: string;
  type: 'visa' | 'mastercard' | 'amex' | 'discover';
  lastFourDigits: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {
  private readonly STORAGE_KEY = 'saved_cards';

  constructor() {
    // Initialize default card if no cards exist
    if (this.getAllCards().length === 0) {
      this.addCard({
        id: this.generateId(),
        cardNumber: '**** **** **** 9999',
        cardHolder: 'User Name',
        expirationDate: '00/11',
        cvv: '',
        type: 'visa',
        lastFourDigits: '9999',
        isDefault: true
      });
    }
  }

 generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Add new card
  addCard(card: CreditCard): void {
    const cards = this.getAllCards();
    
    // If this is the first card, make it default
    if (cards.length === 0) {
      card.isDefault = true;
    }

    // Mask the card number before storing
    const maskedCard = {
      ...card,
      cardNumber: this.maskCardNumber(card.cardNumber),
      lastFourDigits: card.cardNumber.slice(-4)
    };

    cards.push(maskedCard);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cards));
  }

  // Get all saved cards
  getAllCards(): CreditCard[] {
    const cards = localStorage.getItem(this.STORAGE_KEY);
    return cards ? JSON.parse(cards) : [];
  }

  // Get default card
  getDefaultCard(): CreditCard | null {
    const cards = this.getAllCards();
    return cards.find(card => card.isDefault) || null;
  }

  // Set card as default
  setDefaultCard(cardId: string): void {
    const cards = this.getAllCards().map(card => ({
      ...card,
      isDefault: card.id === cardId
    }));
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cards));
  }

  // Update existing card
  updateCard(cardId: string, updates: Partial<CreditCard>): void {
    const cards = this.getAllCards().map(card => {
      if (card.id === cardId) {
        return {
          ...card,
          ...updates,
          cardNumber: updates.cardNumber ? 
            this.maskCardNumber(updates.cardNumber) : 
            card.cardNumber,
          lastFourDigits: updates.cardNumber ? 
            updates.cardNumber.slice(-4) : 
            card.lastFourDigits
        };
      }
      return card;
    });
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cards));
  }

  // Delete card
  deleteCard(cardId: string): void {
    const cards = this.getAllCards();
    const filteredCards = cards.filter(card => card.id !== cardId);
    
    // If we're deleting the default card, make another card default
    if (cards.find(card => card.id === cardId)?.isDefault && filteredCards.length > 0) {
      filteredCards[0].isDefault = true;
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredCards));
  }

  // Validate card number (basic Luhn algorithm)
  validateCardNumber(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;

    // Loop through values starting from the rightmost one
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  // Detect card type based on number
  detectCardType(cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'discover' | null {
    const cleaned = cardNumber.replace(/\D/g, '');
    
    if (cleaned.match(/^4/)) return 'visa';
    if (cleaned.match(/^5[1-5]/)) return 'mastercard';
    if (cleaned.match(/^3[47]/)) return 'amex';
    if (cleaned.match(/^6(?:011|5)/)) return 'discover';
    
    return null;
  }

  // Mask card number
  private maskCardNumber(cardNumber: string): string {
    const last4 = cardNumber.slice(-4);
    return `**** **** **** ${last4}`;
  }

  // Validate expiration date
  validateExpirationDate(expDate: string): boolean {
    const [month, year] = expDate.split('/').map(num => parseInt(num));
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // Get last 2 digits of year
    const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11

    if (!month || !year) return false;
    if (month < 1 || month > 12) return false;
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  }
}