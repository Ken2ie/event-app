export interface NavigationLinks {
    name: string,
    destination: string,
    icon: string
}

export interface Venue {
    name: string;
    address: string;
    capacity: number;
    country: string;
    countryCode: string;
    city: string;
    state?: string;
  }
  
  export interface SocialMedia {
    twitter: string;
    instagram: string;
  }
  
  export interface Organizer {
    userId: string;
    name: string;
    firstName: string;
    lastName: string;
    displayName: string;
    initials: string;
    avatarUrl: string;
    role: string;
    company: string;
    email: string;
    phone: string;
    verified: boolean;
    rating: number;
    eventsOrganized: number;
    memberSince: string;
    socialMedia: SocialMedia;
  }
  
  export interface TicketTier {
    type: string;
    price: number;
    currency: string;
    benefits: string[];
    available: number;
  }
  
  export interface Event {
    id: string;
    title: string;
    type: string;
    date: string;
    time: string;
    venue: Venue;
    organizer: Organizer;
    description: string;
    ticketTiers: TicketTier[];
    status: string;
    tags: string[];
  }


  export interface AllTypes{
    type: string;
    count: number;
    icon: string;
  }


  export interface Payment{
    event: Event;
    ticket: TicketTier;
    quantity: number;
    paid: boolean;
  }

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