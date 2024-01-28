import {Component, Inject, OnInit} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatDialog} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";

export interface DeviceList {
  device: string;
  mountpoint: MountPoint[];
}

export interface MountPoint {
  path: string;
  label: string;
}

export interface DeviceSelected {
  device: string;
  mountPoint: MountPoint;
}

const ELEMENT_DATA: DeviceList[] = [];

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: `./device-list.component.html`,
  styleUrl: './device-list.component.css'
})
export class DeviceListComponent implements OnInit {

  displayedColumns: string[] = ['device', 'mountpoint', 'actions'];
  dataSource : DeviceList[] = [];

  constructor(public dialog: MatDialog) {}

   ngOnInit(): void {
     (<any>window).device.info().then((e:any ) => {
       this.dataSource = e;
     })
  }

  openElement(deviceList : DeviceList, mountPoint : MountPoint) : void {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
        data : {
          'device' : deviceList.device,
          'mountPoint' : mountPoint
        },
    });

    dialogRef.afterClosed().subscribe((result : any) => {
      console.log(result.value)
    });
  }
}

@Component({
  selector: 'dialog-content-add-dialog',
  templateUrl: 'dialog-content-add-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
})
export class DialogContentExampleDialog implements OnInit {
  lightshows : String[] = [];

  deviceName : DeviceSelected;

  toppings = new FormControl('');
  toppingList: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DeviceSelected,
  ) {
    this.deviceName = data;
  }

  ngOnInit(): void {
    (<any>window).lightshow.list().then((e:any ) => {
      this.toppingList = e;
    })
  }
}
