import { Routes } from '@angular/router';
import {DeviceListComponent} from "./device-list/device-list.component";
import {HomeComponent} from "./home/home.component";
import {DeviceAutoAddComponent} from "./device-auto-add/device-auto-add.component";

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home page',
    pathMatch: "full"
  },
  {
    path: 'device-list',
    component: DeviceListComponent,
    title: 'Lightshow',
    pathMatch: "full"
  },
  {
    path: 'device-copy-auto',
    component: DeviceAutoAddComponent,
    title: 'Auto copy Lightshow',
    pathMatch: "full"
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
];
