import { Injectable } from '@angular/core';
import eventsData from '../../utils/data-store/events-data.json';
import { AllTypes } from '../../utils/app.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsDataService {

  constructor() { }

  getAllCategoriesByType() : Observable<Array<AllTypes>> {
    const typeCountMap: Record<string, number> = {};

    const typeIcons: Record<string, string> = {
      "Music & Entertainment": "🎤",
      "Sports & Gaming": "🛠️",
      "Festivals & Celebrations": "🏢",
      "Arts & Culture": "📚"
    };

    eventsData.events.forEach(event => {
      typeCountMap[event.type] = (typeCountMap[event.type] || 0) + 1;
    });

    const allTypes: Array<AllTypes> = Object.entries(typeCountMap).map(([type, count,]) => ({
      type,
      count,
      icon: typeIcons[type] || "❓" 
    }));

    return of(allTypes);
  }


  getEventsByType(type: string) {
    return of(eventsData.events.filter(event => event.type === type));
  }

  getAnEventById(id: string) {
    return of(eventsData.events.find(event => event.id === id));
  }
}
