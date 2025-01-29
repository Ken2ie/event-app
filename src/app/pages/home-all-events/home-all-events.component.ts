import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "../../shared/nav-bar/nav-bar.component";

@Component({
  selector: 'app-home-all-events',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './home-all-events.component.html',
  styleUrl: './home-all-events.component.css'
})
export class HomeAllEventsComponent {

}
