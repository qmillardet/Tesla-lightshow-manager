
import {Component, ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { usb, getDeviceList } from 'usb';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-teslalightshow-manager';

  constructor() {

    const drivelist = require('drivelist');

    drivelist.list().then((drives : any) => {

      drives.forEach((drive : any) => {
        console.log(drive);
      });
    });
  }



}
