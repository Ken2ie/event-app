import { Component, Input } from '@angular/core';
import { AllTypes } from '../../../../../../utils/app.interface';

@Component({
  selector: 'app-category-cards',
  standalone: true,
  imports: [],
  templateUrl: './category-cards.component.html',
  styleUrl: './category-cards.component.css'
})
export class CategoryCardsComponent {

  @Input() allTypes! : AllTypes;

}
