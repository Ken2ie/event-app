import { Component, inject, OnInit } from '@angular/core';
import { AllTypes } from '../../../../utils/app.interface';
import { EventsDataService } from '../../../../services/events-data/events-data.service';
import { CategoryCardsComponent } from './components/category-cards/category-cards.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [CategoryCardsComponent, RouterLink],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.css'
})
export class DiscoverComponent implements OnInit{

  AllTypes : Array<AllTypes> = []
  
  eventDataService = inject(EventsDataService)

  ngOnInit(): void {
    this.getAllTypes()
  }

  getAllTypes(){
    this.eventDataService.getAllCategoriesByType().subscribe({
      next: (results: Array<AllTypes>) => {
        this.AllTypes = results;
      }
    })
  }


}
