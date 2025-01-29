import { Routes } from '@angular/router';
import { HomeAllEventsComponent } from './pages/home-all-events/home-all-events.component';
import { DiscoverComponent } from './pages/home-all-events/sub-pages/discover/discover.component';
import { YourEventsComponent } from './pages/home-all-events/sub-pages/your-events/your-events.component';
import { FilteredEventsComponent } from './pages/home-all-events/filtered-events/filtered-events.component';
import { PaymentComponent } from './pages/payment/payment.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeAllEventsComponent,
        title: 'All Events',
        children: [
            {
                redirectTo: 'discover',
                path: '',
                pathMatch: 'full'
            },
            {
                path: 'discover',
                component: DiscoverComponent,
                title: 'Discover'
            },
            {
                path: 'events',
                component: YourEventsComponent,
                title: 'All Your Events'
            },
            {
                path: 'filtered-events',
                component: FilteredEventsComponent,
                title: 'Events'
            },
            {
                path: 'payment',
                component: PaymentComponent,
                title: 'Payment'
            }
        ]
    }
];
