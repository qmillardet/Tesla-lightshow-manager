import { Routes } from '@angular/router';
import {DeviceListComponent} from "./device-list/device-list.component";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page'
  },
  {
    path: 'device-list',
    component: DeviceListComponent,
    title: 'Home details'
  }
];
