import {Component, OnInit} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";

export interface DeviceList {
  device: string;
  mountpoint: MountPoint[];
}

export interface MountPoint {
  path: string;
  label: string;
}

const ELEMENT_DATA: DeviceList[] = [];

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: `./device-list.component.html`,
  styleUrl: './device-list.component.css'
})
export class DeviceListComponent implements OnInit {

  displayedColumns: string[] = ['device', 'mountpoint', 'actions'];
  dataSource : DeviceList[] = [];

   ngOnInit(): void {
     (<any>window).versions.deviceInfo().then((e:any ) => {
       this.dataSource = e;
     })
  }

  openElement(deviceList : DeviceList) : void {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  openDialog() {

  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogContentExampleDialog {}
