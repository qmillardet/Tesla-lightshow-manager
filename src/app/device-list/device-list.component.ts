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
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarComponent} from "../snackbar/snackbar.component";
import {MatOption, MatOptionModule} from "@angular/material/core";

export interface DeviceList {
  device: string;
  mountpoint: MountPoint[];
}

export interface MountPoint {
  path: string;
  label: string;
}

export interface LigthShowDto {
  lightshowName: string;
  onDevice: boolean;
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

  displayedColumns: string[] = ['mountpoint', 'actions'];
  dataSource : DeviceList[] = [];

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar) {}

   ngOnInit(): void {
     (<any>window).device.info().then((e:any ) => {
       this.dataSource = e;
     })
  }
  openSnackBar(message : string) {
    this._snackBar.open(message,"Fermer");
  }

  openElement( mountPoint : MountPoint) : void {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      data: mountPoint,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      let deviceName: string = result.device.device;
      let mountPoint: string = result.device.mountPoint.label
      let lightshows: string[] = result.lightshows.value;
      let resSuccess: string[] = [];
      let resError: string[] = [];
      if (lightshows) {
        lightshows.forEach(async (lightshow: string) => {

          if (lightshow) {
            try{

              const {error, result} = await (<any>window).lightshow.copy(deviceName, mountPoint, lightshow)
              if (error) {
                this.openSnackBar("Error (" + lightshow + ")")
              } else {
                this.openSnackBar("Copy finish (" + lightshow + ")")
              }
            } catch (e){
              this.openSnackBar("Error (" + lightshow + ")")
            }
          }

        });
      }
    });
  }
}

@Component({
  selector: 'dialog-content-add-dialog',
  templateUrl: 'dialog-content-add-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatOptionModule],
})
export class DialogContentExampleDialog implements OnInit {
  deviceName : MountPoint;

  toppings = new FormControl('');
  toppingList: LigthShowDto[] = [];
  selectedElement : string[] =[];

  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: MountPoint,
  ) {
    this.deviceName = data;
  }

  ngOnInit(): void {
    (<any>window).lightshow.list(this.deviceName).then((e:LigthShowDto[] ) => {
      this.selectedElement = [];
      e.forEach((lightShowDTO : LigthShowDto) => {
        if (lightShowDTO.onDevice){
          this.selectedElement.push(lightShowDTO.lightshowName)
        }
      })
      console.log(this.selectedElement);
      this.toppingList = e;
    })
  }
}
