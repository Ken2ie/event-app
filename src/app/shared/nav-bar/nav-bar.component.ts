import { Component, OnInit } from '@angular/core';
import { NavigationLinks } from '../../utils/app.interface';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit{

  currentTimeObserver: Observable<Date> = interval(1000).pipe(
    map(() => new Date())
  );

  ngOnInit(): void {
    this.getTheCurrentTime();
  }

  currentTime : Date = new Date();

  getTheCurrentTime() {
    this.currentTimeObserver.subscribe({
      next: (time) => {
        return this.currentTime = time;
      }
    })
  }
  
  navLinks :  NavigationLinks[] = [
    {
      name: 'Upcoming Events',
      destination: 'events',
      icon: 'confirmation_number'
    },
    {
      name: 'Discover',
      destination: 'discover',
      icon: 'explore'
    },
  ]

}
